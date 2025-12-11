'use client';

import { useState, useEffect, useCallback } from 'react';

interface LeaderboardEntry {
    id: string;
    username: string;
    aura: number;
    level: number;
    streak: number;
    tasksCompleted: number;
    rank: number;
}

interface UseLeaderboardOptions {
    type?: 'global' | 'friends' | 'squad' | 'city';
    limit?: number;
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
    const { type = 'global', limit = 10 } = options;

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const fetchLeaderboard = useCallback(async (newOffset = 0) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/leaderboard?type=${type}&limit=${limit}&offset=${newOffset}`
            );
            if (!response.ok) throw new Error('Failed to fetch leaderboard');

            const data = await response.json();

            if (newOffset === 0) {
                setLeaderboard(data.leaderboard);
            } else {
                setLeaderboard((prev) => [...prev, ...data.leaderboard]);
            }

            setTotal(data.total);
            setOffset(newOffset);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [type, limit]);

    const loadMore = () => {
        if (leaderboard.length < total) {
            fetchLeaderboard(offset + limit);
        }
    };

    useEffect(() => {
        fetchLeaderboard(0);
    }, [fetchLeaderboard]);

    return {
        leaderboard,
        loading,
        error,
        total,
        hasMore: leaderboard.length < total,
        loadMore,
        refetch: () => fetchLeaderboard(0),
    };
}
