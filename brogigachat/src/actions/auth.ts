'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function login(formData: FormData) {
    const supabase = createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(formData: FormData) {
    const supabase = createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    // Check if username is taken
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });

    if (existingUser) {
        return { error: 'Username already taken' };
    }

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Create user in database
    if (authData.user) {
        await prisma.user.create({
            data: {
                id: authData.user.id,
                email,
                username,
            },
        });
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signInWithMagicLink(email: string) {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function signInWithOAuth(provider: 'google' | 'github' | 'twitter') {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}

export async function getUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get full user data from database
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            badges: { include: { badge: true } },
        },
    });

    return dbUser;
}
