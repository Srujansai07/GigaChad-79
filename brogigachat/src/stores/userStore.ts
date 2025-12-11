import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, getLevelInfo, LevelInfo } from '@/types';

interface UserState {
    user: User;
    isOnboarded: boolean;
    levelInfo: LevelInfo;

    // Actions
    setUsername: (username: string) => void;
    completeOnboarding: () => void;
    addAura: (amount: number) => void;
    deductAura: (amount: number) => void;
    incrementStreak: () => void;
    incrementTasksCompleted: () => void;
    incrementStrictModeCount: () => void;
    resetProgress: () => void;
    loadUser: () => void;
}

const defaultUser: User = {
    username: 'NewGrinder',
    aura: 0,
    level: 1,
    streak: 0,
    lastActive: new Date().toISOString(),
    tasksCompleted: 0,
    strictModeCount: 0,
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: defaultUser,
            isOnboarded: false,
            levelInfo: getLevelInfo(0),

            setUsername: (username: string) => {
                set((state) => ({
                    user: { ...state.user, username },
                }));
            },

            completeOnboarding: () => {
                set({ isOnboarded: true });
            },

            addAura: (amount: number) => {
                set((state) => {
                    const newAura = state.user.aura + amount;
                    return {
                        user: { ...state.user, aura: newAura },
                        levelInfo: getLevelInfo(newAura),
                    };
                });
            },

            deductAura: (amount: number) => {
                set((state) => ({
                    user: { ...state.user, aura: Math.max(0, state.user.aura - amount) },
                }));
            },

            incrementStreak: () => {
                set((state) => ({
                    user: {
                        ...state.user,
                        streak: state.user.streak + 1,
                        lastActive: new Date().toISOString(),
                    },
                }));
            },

            incrementTasksCompleted: () => {
                set((state) => ({
                    user: { ...state.user, tasksCompleted: state.user.tasksCompleted + 1 },
                }));
            },

            incrementStrictModeCount: () => {
                set((state) => ({
                    user: { ...state.user, strictModeCount: state.user.strictModeCount + 1 },
                }));
            },

            resetProgress: () => {
                set({
                    user: defaultUser,
                    isOnboarded: false,
                    levelInfo: getLevelInfo(0),
                });
            },

            loadUser: () => {
                // State is auto-loaded by persist middleware
                // This just recalculates level info
                const currentAura = get().user.aura;
                set({ levelInfo: getLevelInfo(currentAura) });
            },
        }),
        {
            name: 'bro-user-storage',
        }
    )
);
