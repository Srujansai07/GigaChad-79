import { create } from 'zustand';
import { Habit } from '@/types';

interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchHabits: () => Promise<void>;
    addHabit: (name: string, frequency: 'DAILY' | 'WEEKLY') => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    completeHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: [],
    isLoading: false,
    error: null,

    fetchHabits: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/habits');
            if (!response.ok) throw new Error('Failed to fetch habits');

            const data = await response.json();
            set({ habits: data.habits });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addHabit: async (name: string, frequency: 'DAILY' | 'WEEKLY') => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, frequency }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add habit');
            }

            const { habit } = await response.json();
            set((state) => ({ habits: [...state.habits, habit] }));
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteHabit: async (id: string) => {
        // Optimistic update
        const previousHabits = get().habits;
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));

        try {
            const response = await fetch(`/api/habits/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete habit');
        } catch (error: any) {
            // Revert on error
            set({ habits: previousHabits, error: error.message });
        }
    },

    completeHabit: async (id: string) => {
        // Optimistic update
        const previousHabits = get().habits;
        set((state) => ({
            habits: state.habits.map((h) =>
                h.id === id ? { ...h, completedToday: true, streak: h.streak + 1 } : h
            ),
        }));

        try {
            const response = await fetch(`/api/habits/${id}/complete`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to complete habit');

            const { habit, auraGained } = await response.json();

            // Update with actual server data (in case of streak bonuses etc)
            set((state) => ({
                habits: state.habits.map((h) => (h.id === id ? habit : h)),
            }));

            return auraGained;
        } catch (error: any) {
            // Revert
            set({ habits: previousHabits, error: error.message });
            throw error;
        }
    },
}));
