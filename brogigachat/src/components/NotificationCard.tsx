'use client';

import { Flame, Zap, AlertCircle, X } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';

export default function NotificationCard() {
    const { tasks, activeNotificationTaskId, skipCounts, extendTask, completeTask, dismissNotification } = useTaskStore();
    const { user } = useUserStore();

    if (!activeNotificationTaskId) return null;

    const task = tasks.find((t) => t.id === activeNotificationTaskId);
    if (!task) return null;

    const skips = skipCounts[task.id] || 0;
    const remainingSkips = 3 - skips;

    // Calculate potential aura
    let potentialAura = task.baseAura;
    if (skips === 0) potentialAura *= 2;
    if (user.streak > 7) potentialAura *= 1.5;
    potentialAura = Math.floor(potentialAura);

    const handleExtend = (minutes: number) => {
        extendTask(task.id, minutes);
    };

    const handleDoIt = () => {
        completeTask(task.id, false);
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-xl w-full max-w-sm p-6 shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔔</span>
                        <span className="font-bold text-primary">BROGIGACHAD</span>
                    </div>
                    <button
                        onClick={dismissNotification}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-alt"
                    >
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Task Info */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{task.title}</h3>
                    {task.description && (
                        <p className="text-gray-400 text-sm">{task.description}</p>
                    )}
                </div>

                {/* Motivational Message */}
                <p className="text-gray-300 mb-4 italic">
                    &quot;You promised yourself this. Let&apos;s get it done.&quot;
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-2 text-streak">
                        <Flame size={16} />
                        <span>{user.streak} day streak</span>
                    </div>
                    <div className="flex items-center gap-2 text-aura">
                        <Zap size={16} />
                        <span>+{potentialAura} Aura</span>
                    </div>
                </div>

                {/* Skip Warning */}
                {skips > 0 && (
                    <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2 text-warning">
                        <AlertCircle size={18} />
                        <span className="text-sm">
                            Skip #{skips} - {remainingSkips} more until Strict Mode 💀
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => handleExtend(10)}
                        className="py-3 bg-surface-alt hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                    >
                        +10 min
                    </button>
                    <button
                        onClick={() => handleExtend(30)}
                        className="py-3 bg-surface-alt hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                    >
                        +30 min
                    </button>
                    <button
                        onClick={handleDoIt}
                        className="py-3 bg-primary hover:bg-primary-hover rounded-lg text-white font-bold text-sm transition-colors"
                    >
                        DO IT
                    </button>
                </div>

                {/* Skip Preview */}
                <p className="text-center text-xs text-gray-500 mt-3">
                    Extending costs -50 Aura
                </p>
            </div>
        </div>
    );
}
