'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    aura: number;
    level: number;
    streak: number;
    tasksCompleted: number;
    tasksToday: number;
    strictModeSessions: number;
    rank: number;
    badges: any[];
    notificationsEnabled: boolean;
    strictModeEnabled: boolean;
}

export function useUser() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user');
            if (!response.ok) {
                if (response.status === 401) {
                    setUser(null);
                    return;
                }
                throw new Error('Failed to fetch user');
            }

            const data = await response.json();
            setUser(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = async (updates: Partial<UserProfile>) => {
        try {
            const response = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Failed to update user');

            const data = await response.json();
            setUser((prev) => prev ? { ...prev, ...data.user } : null);
            return data.user;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return {
        user,
        loading,
        error,
        fetchUser,
        updateUser,
        isAuthenticated: !!user,
        refetch: fetchUser,
    };
}
