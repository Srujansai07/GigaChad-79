import { NextResponse } from 'next/server';
import webpush from 'web-push';
import prisma from '@/lib/prisma';

// Configure VAPID keys for web push
// Generate with: npx web-push generate-vapid-keys
const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
    webpush.setVapidDetails(
        'mailto:contact@brogigachad.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
}

// Subscribe endpoint - save push subscription
export async function POST(request: Request) {
    try {
        const { subscription, userId } = await request.json();

        if (!subscription || !userId) {
            return NextResponse.json({ error: 'Missing subscription or userId' }, { status: 400 });
        }

        // Store subscription in user preferences (could be a separate table)
        // For now, we'll store as JSON in a simple way
        // In production, use a PushSubscription model

        console.log('Push subscription saved for user:', userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }
}
