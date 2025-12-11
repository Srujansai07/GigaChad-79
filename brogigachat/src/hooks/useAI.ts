'use client';

import { useState, useCallback } from 'react';
import type { TaskEnhancement, VoicePack } from '@/lib/ai';

interface UseAIReturn {
    loading: boolean;
    error: string | null;
    enhanceTask: (title: string, type: TaskEnhancement['type'], context?: string) => Promise<TaskEnhancement | null>;
    getMotivation: (streak: number, tasksToday: number, skipReason?: string) => Promise<string>;
    setVoicePack: (pack: VoicePack) => void;
    voicePack: VoicePack;
}

export function useAI(): UseAIReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [voicePack, setVoicePack] = useState<VoicePack>('topg');

    const enhanceTask = useCallback(async (
        title: string,
        type: TaskEnhancement['type'],
        context?: string
    ): Promise<TaskEnhancement | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'enhance',
                    taskTitle: title,
                    taskType: type,
                    userContext: context,
                    voicePack,
                }),
            });

            if (!response.ok) {
                throw new Error('AI request failed');
            }

            return await response.json();
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [voicePack]);

    const getMotivation = useCallback(async (
        streak: number,
        tasksToday: number,
        skipReason?: string
    ): Promise<string> => {
        setLoading(true);
        setError(null);

        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'motivate',
                    streak,
                    tasksToday,
                    skipReason,
                    timeOfDay,
                    voicePack,
                }),
            });

            if (!response.ok) {
                throw new Error('AI request failed');
            }

            const data = await response.json();
            return data.message;
        } catch (err: any) {
            setError(err.message);
            return "Let's get it. No excuses.";
        } finally {
            setLoading(false);
        }
    }, [voicePack]);

    return {
        loading,
        error,
        enhanceTask,
        getMotivation,
        setVoicePack,
        voicePack,
    };
}
