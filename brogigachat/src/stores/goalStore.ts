import { create } from 'zustand';
import { Goal } from '@/types';

interface GoalState {
    goals: Goal[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchGoals: () => Promise<void>;
    addGoal: (data: Partial<Goal>) => Promise<void>;
    updateProgress: (id: string, current: number) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
    goals: [],
    isLoading: false,
    error: null,

    fetchGoals: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/goals');
            if (!response.ok) throw new Error('Failed to fetch goals');

            const data = await response.json();
            set({ goals: data.goals });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addGoal: async (data: Partial<Goal>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || 'Failed to add goal');
            }

            const { goal } = await response.json();
            set((state) => ({ goals: [...state.goals, goal] }));
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProgress: async (id: string, current: number) => {
        // Optimistic update
        const previousGoals = get().goals;
        set((state) => ({
            goals: state.goals.map((g) =>
                g.id === id ? { ...g, current } : g
            ),
        }));

        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current }),
            });

            if (!response.ok) throw new Error('Failed to update progress');

            const { goal, auraGained } = await response.json();

            // Update with server data (to handle completion status etc)
            set((state) => ({
                goals: state.goals.map((g) => (g.id === id ? goal : g)),
            }));

            return auraGained;
        } catch (error: any) {
            // Revert
            set({ goals: previousGoals, error: error.message });
            throw error;
        }
    },

    deleteGoal: async (id: string) => {
        // Optimistic update
        const previousGoals = get().goals;
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));

        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete goal');
        } catch (error: any) {
            // Revert
            set({ goals: previousGoals, error: error.message });
        }
    },
}));
