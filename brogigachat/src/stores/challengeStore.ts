import { create } from 'zustand';
import { Challenge } from '@/types';

interface ChallengeState {
    challenges: Challenge[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchChallenges: () => Promise<void>;
    joinChallenge: (id: string) => Promise<void>;
    updateProgress: (id: string, progress: number) => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
    challenges: [],
    isLoading: false,
    error: null,

    fetchChallenges: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/challenges');
            if (!response.ok) throw new Error('Failed to fetch challenges');

            const data = await response.json();
            set({ challenges: data.challenges });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    joinChallenge: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/challenges/${id}/join`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to join challenge');

            const { challenge } = await response.json();

            // Update local state
            set((state) => ({
                challenges: state.challenges.map((c) =>
                    c.id === id ? { ...c, ...challenge } : c
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProgress: async (id: string, progress: number) => {
        // Optimistic update
        const previousChallenges = get().challenges;
        set((state) => ({
            challenges: state.challenges.map((c) =>
                c.id === id ? { ...c, progress } : c
            ),
        }));

        try {
            const response = await fetch(`/api/challenges/${id}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress }),
            });

            if (!response.ok) throw new Error('Failed to update progress');

            const { challenge, auraGained } = await response.json();

            set((state) => ({
                challenges: state.challenges.map((c) =>
                    c.id === id ? { ...c, ...challenge } : c
                ),
            }));

            return auraGained;
        } catch (error: any) {
            // Revert
            set({ challenges: previousChallenges, error: error.message });
            throw error;
        }
    },
}));
