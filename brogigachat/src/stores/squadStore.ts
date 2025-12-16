import { create } from 'zustand';
import { Squad } from '@/types';

interface SquadState {
    squad: Squad | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSquad: () => Promise<void>;
    createSquad: (name: string, description: string) => Promise<void>;
    joinSquad: (code: string) => Promise<void>;
    leaveSquad: () => Promise<void>;
    deleteSquad: () => Promise<void>;
}

export const useSquadStore = create<SquadState>((set, get) => ({
    squad: null,
    isLoading: false,
    error: null,

    fetchSquad: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/squads');
            if (response.status === 404) {
                set({ squad: null });
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch squad');

            const data = await response.json();
            set({ squad: data.squad });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    createSquad: async (name: string, description: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/squads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create squad');
            }

            const { squad } = await response.json();
            set({ squad });
        } catch (error: any) {
            set({ error: error.message });
            throw error; // Re-throw to handle in UI
        } finally {
            set({ isLoading: false });
        }
    },

    joinSquad: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/squads/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to join squad');
            }

            const { squad } = await response.json();
            set({ squad });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    leaveSquad: async () => {
        set({ isLoading: true, error: null });
        const { squad } = get();
        if (!squad) return;

        try {
            const response = await fetch(`/api/squads/${squad.id}`, {
                method: 'DELETE', // Using DELETE for leaving as well for simplicity in this MVP, or we can use a specific endpoint
                // Actually, let's check the implementation plan. 
                // Plan says: DELETE: Leave/Delete squad.
            });

            if (!response.ok) throw new Error('Failed to leave squad');

            set({ squad: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSquad: async () => {
        // Same as leave for now, backend handles logic based on if user is leader
        return get().leaveSquad();
    },
}));
