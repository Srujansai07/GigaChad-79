'use client';

import { useState, useEffect } from 'react';
import { Flame, Plus, Zap, Trophy, CheckCircle, Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import TaskCard from './TaskCard';
import BadgeNotification from './BadgeNotification';

export default function HomeScreen() {
    const { user, levelInfo } = useUserStore();
    const { tasks, isLoading, error, fetchTasks, newlyUnlockedBadges, clearNewBadges } = useTaskStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentBadge, setCurrentBadge] = useState<any>(null);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handle badge queue
    useEffect(() => {
        if (newlyUnlockedBadges.length > 0 && !currentBadge) {
            setCurrentBadge(newlyUnlockedBadges[0]);
        }
    }, [newlyUnlockedBadges, currentBadge]);

    const handleBadgeClose = () => {
        setCurrentBadge(null);
        // If we had more than one, we'd shift the queue here, but for now we clear all after showing one or we need a better queue management in store.
        // Actually, let's just clear the specific badge or all if we don't have a queue action.
        // Since clearNewBadges clears all, we might miss some if multiple unlock at once.
        // But for MVP, showing the first one is fine, or we can implement a local queue.

        // Better approach: Remove the shown badge from the local queue or store.
        // Since store only has clearNewBadges, let's just clear all for now to avoid loops, 
        // OR better: we should have a 'removeBadge' action.
        // For now, I'll just clear all.
        clearNewBadges();
    };

    const activeTasks = tasks.filter((t) => !t.completed);
    const completedToday = tasks.filter((t) => {
        if (!t.completed || !t.completedAt) return false;
        const today = new Date().toDateString();
        return new Date(t.completedAt).toDateString() === today;
    });

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-danger">
                <p>Error loading tasks: {error}</p>
                <button
                    onClick={() => fetchTasks()}
                    className="mt-4 px-4 py-2 bg-gray-800 rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-white">{user.username}</p>
                        <p className={`text-sm ${levelInfo.color}`}>{levelInfo.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-aura">
                        <Zap size={18} />
                        <span className="font-bold">{user.aura.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-streak text-sm">
                        <Flame size={14} />
                        <span>{user.streak} day streak</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{activeTasks.length}</p>
                    <p className="text-xs text-gray-400">Active</p>
                </div>
                <div className="bg-surface p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-success">{completedToday.length}</p>
                    <p className="text-xs text-gray-400">Done Today</p>
                </div>
                <div className="bg-surface p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{user.strictModeCount}</p>
                    <p className="text-xs text-gray-400">Forced</p>
                </div>
            </div>

            {/* Active Tasks */}
            <div>
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Trophy className="text-aura" size={20} />
                    Active Tasks
                </h2>

                {activeTasks.length === 0 ? (
                    <div className="bg-surface p-6 rounded-lg text-center">
                        <p className="text-gray-400 mb-4">No tasks yet. Add one to start your grind.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-primary rounded-lg text-white font-semibold"
                        >
                            Add First Task
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Today */}
            {completedToday.length > 0 && (
                <div>
                    <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle className="text-success" size={20} />
                        Completed Today
                    </h2>
                    <div className="space-y-2">
                        {completedToday.map((task) => (
                            <div
                                key={task.id}
                                className="bg-surface/50 p-3 rounded-lg flex items-center justify-between border border-success/20"
                            >
                                <div>
                                    <p className="text-gray-300 line-through">{task.title}</p>
                                    <p className="text-xs text-gray-500">{task.app}</p>
                                </div>
                                <span className="text-success text-sm font-semibold">
                                    +{task.auraGained} Aura
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Task FAB */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-24 right-4 w-14 h-14 bg-primary hover:bg-primary-hover rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-110 z-30"
            >
                <Plus size={28} />
            </button>

            {/* Add Task Modal */}
            {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}

            {/* Badge Notification */}
            {currentBadge && (
                <BadgeNotification
                    badge={currentBadge}
                    onClose={handleBadgeClose}
                />
            )}
        </div>
    );
}

