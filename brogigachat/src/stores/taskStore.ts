import { create } from 'zustand';
import { Task, calculateAuraGain } from '@/types';
import { useUserStore } from './userStore';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    activeNotificationTaskId: string | null;
    strictModeActive: boolean;
    strictModeTask: Task | null;

    newlyUnlockedBadges: any[]; // Using any[] to avoid circular dependency or complex type imports for now
    clearNewBadges: () => void;

    // Actions
    fetchTasks: () => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'created' | 'completed' | 'skips'>) => Promise<void>;
    completeTask: (taskId: string, fromStrictMode?: boolean) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    extendTask: (taskId: string, minutes: number) => Promise<void>;

    // UI Actions
    triggerNotification: (taskId: string) => void;
    dismissNotification: () => void;
    activateStrictMode: (task: Task) => void;
    deactivateStrictMode: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    activeNotificationTaskId: null,
    strictModeActive: false,
    strictModeTask: null,
    newlyUnlockedBadges: [],

    clearNewBadges: () => set({ newlyUnlockedBadges: [] }),

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/tasks?status=active');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            set({ tasks: data.tasks });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) throw new Error('Failed to create task');
            const { task } = await response.json();

            set((state) => ({ tasks: [...state.tasks, task] }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    completeTask: async (taskId: string, fromStrictMode = false) => {
        // Optimistic update
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Optimistically remove from list (or mark completed)
        set((state) => ({
            tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: true } : t)
        }));

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete' }),
            });

            if (!response.ok) throw new Error('Failed to complete task');
            const { auraGained, newBadges } = await response.json();

            // Update user store
            const userStore = useUserStore.getState();
            userStore.addAura(auraGained);
            userStore.incrementTasksCompleted();
            userStore.incrementStreak();
            if (fromStrictMode) userStore.incrementStrictModeCount();

            // Handle new badges
            if (newBadges && newBadges.length > 0) {
                set({ newlyUnlockedBadges: newBadges });
            }

            // Refresh tasks to ensure sync
            get().fetchTasks();

        } catch (error: any) {
            // Revert on error
            set({ error: error.message });
            get().fetchTasks(); // Re-fetch to restore state
        }
    },

    deleteTask: async (taskId: string) => {
        // Optimistic update
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId)
        }));

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');
        } catch (error: any) {
            set({ error: error.message });
            get().fetchTasks(); // Re-fetch to restore state
        }
    },

    extendTask: async (taskId: string, minutes: number) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'skip', extendMinutes: minutes }),
            });

            if (!response.ok) throw new Error('Failed to skip task');
            const { task, auraLost } = await response.json();

            // Update user store
            useUserStore.getState().deductAura(auraLost);

            // Update task in list
            set((state) => ({
                tasks: state.tasks.map((t) => t.id === taskId ? task : t),
                activeNotificationTaskId: null
            }));

            // Check strict mode trigger from response
            if (task.strictModeTriggered) {
                get().activateStrictMode(task);
            }

        } catch (error: any) {
            set({ error: error.message });
        }
    },

    triggerNotification: (taskId: string) => {
        set({ activeNotificationTaskId: taskId });
    },

    dismissNotification: () => {
        set({ activeNotificationTaskId: null });
    },

    activateStrictMode: (task: Task) => {
        set({
            strictModeActive: true,
            strictModeTask: task,
            activeNotificationTaskId: null,
        });
    },

    deactivateStrictMode: () => {
        set({
            strictModeActive: false,
            strictModeTask: null,
        });
    },
}));

