import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, calculateAuraGain } from '@/types';
import { useUserStore } from './userStore';

interface TaskState {
    tasks: Task[];
    skipCounts: Record<string, number>;
    activeNotificationTaskId: string | null;
    strictModeActive: boolean;
    strictModeTask: Task | null;

    // Task CRUD
    addTask: (task: Omit<Task, 'id' | 'created' | 'completed' | 'skips'>) => void;
    completeTask: (taskId: string, fromStrictMode?: boolean) => void;
    deleteTask: (taskId: string) => void;

    // Notification flow
    triggerNotification: (taskId: string) => void;
    dismissNotification: () => void;
    extendTask: (taskId: string, minutes: number) => void;

    // Strict Mode
    activateStrictMode: (task: Task) => void;
    deactivateStrictMode: () => void;

    // Persistence
    loadTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],
            skipCounts: {},
            activeNotificationTaskId: null,
            strictModeActive: false,
            strictModeTask: null,

            addTask: (taskData) => {
                const newTask: Task = {
                    id: Date.now().toString(),
                    ...taskData,
                    created: new Date().toISOString(),
                    completed: false,
                    skips: 0,
                };
                set((state) => ({
                    tasks: [...state.tasks, newTask],
                }));
            },

            completeTask: (taskId: string, fromStrictMode = false) => {
                const state = get();
                const task = state.tasks.find((t) => t.id === taskId);
                if (!task) return;

                const skips = state.skipCounts[taskId] || 0;
                const userStore = useUserStore.getState();

                // Calculate aura with multipliers
                const auraGained = calculateAuraGain(task.baseAura, {
                    firstNotification: skips === 0,
                    fromStrictMode,
                    streakDays: userStore.user.streak,
                });

                // Update user stats
                userStore.addAura(auraGained);
                userStore.incrementTasksCompleted();
                userStore.incrementStreak();
                if (fromStrictMode) {
                    userStore.incrementStrictModeCount();
                }

                // Update task
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === taskId
                            ? {
                                ...t,
                                completed: true,
                                completedAt: new Date().toISOString(),
                                auraGained,
                            }
                            : t
                    ),
                    activeNotificationTaskId: null,
                    strictModeActive: false,
                    strictModeTask: null,
                }));
            },

            deleteTask: (taskId: string) => {
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== taskId),
                    skipCounts: { ...state.skipCounts, [taskId]: undefined } as Record<string, number>,
                }));
            },

            triggerNotification: (taskId: string) => {
                set({ activeNotificationTaskId: taskId });
            },

            dismissNotification: () => {
                set({ activeNotificationTaskId: null });
            },

            extendTask: (taskId: string, minutes: number) => {
                const state = get();
                const currentSkips = state.skipCounts[taskId] || 0;
                const newSkips = currentSkips + 1;
                const task = state.tasks.find((t) => t.id === taskId);

                // Deduct aura for skipping
                useUserStore.getState().deductAura(50);

                // Update skip count and reschedule
                const newScheduledTime = new Date(Date.now() + minutes * 60000).toISOString();

                set((state) => ({
                    skipCounts: { ...state.skipCounts, [taskId]: newSkips },
                    tasks: state.tasks.map((t) =>
                        t.id === taskId
                            ? { ...t, scheduledFor: newScheduledTime, skips: newSkips }
                            : t
                    ),
                }));

                // Check for Strict Mode trigger
                if (newSkips >= 3 && task) {
                    get().activateStrictMode(task);
                } else {
                    set({ activeNotificationTaskId: null });
                }
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

            loadTasks: () => {
                // State is auto-loaded by persist middleware
                // Filter out old completed tasks (older than 24 hours)
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                set((state) => ({
                    tasks: state.tasks.filter(
                        (t) => !t.completed || (t.completedAt && t.completedAt > oneDayAgo)
                    ),
                }));
            },
        }),
        {
            name: 'bro-tasks-storage',
        }
    )
);
