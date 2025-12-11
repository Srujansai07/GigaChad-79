'use client';

import { AlertCircle, Zap, Clock, Check } from 'lucide-react';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const { triggerNotification, completeTask, skipCounts } = useTaskStore();
    const { user } = useUserStore();
    const skips = skipCounts[task.id] || 0;

    const handleComplete = () => {
        completeTask(task.id, false);
    };

    const handleTestNotification = () => {
        triggerNotification(task.id);
    };

    // Calculate potential aura with multipliers
    let potentialAura = task.baseAura;
    if (skips === 0) potentialAura *= 2;
    if (user.streak > 7) potentialAura *= 1.5;
    potentialAura = Math.floor(potentialAura);

    return (
        <div className="bg-surface p-4 rounded-lg border border-gray-800">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-surface-alt px-2 py-1 rounded text-gray-400">
                            {task.app}
                        </span>
                        <span className="text-xs flex items-center gap-1 text-aura">
                            <Zap size={12} />
                            +{potentialAura}
                        </span>
                    </div>
                </div>
            </div>

            {/* Skip Warning */}
            {skips > 0 && skips < 3 && (
                <div className="mb-3 p-2 bg-warning/10 border border-warning/30 rounded flex items-center gap-2 text-warning text-sm">
                    <AlertCircle size={16} />
                    <span>Skip #{skips} - {3 - skips} more until Strict Mode</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleTestNotification}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-surface-alt hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                >
                    <Clock size={16} />
                    Test Notification
                </button>
                <button
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary-hover rounded-lg text-white text-sm font-semibold transition-colors"
                >
                    <Check size={16} />
                    Complete Now
                </button>
            </div>
        </div>
    );
}
