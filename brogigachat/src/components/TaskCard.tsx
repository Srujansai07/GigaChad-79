'use client';

import { useState } from 'react';
import { AlertCircle, Zap, Clock, Check, Loader2 } from 'lucide-react';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const { triggerNotification, completeTask } = useTaskStore();
    const { user } = useUserStore();
    const [isCompleting, setIsCompleting] = useState(false);

    // Use task.skips directly as it's now part of the Task object from API
    const skips = task.skips || 0;

    const handleComplete = async () => {
        setIsCompleting(true);
        // Wait for exit animation
        setTimeout(async () => {
            try {
                await completeTask(task.id, false);
            } catch (error) {
                console.error('Failed to complete task:', error);
                setIsCompleting(false);
            }
        }, 500);
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
        <div className={`bg-surface p-4 rounded-lg border border-gray-800 transition-all duration-500 animate-slide-up ${isCompleting ? 'opacity-0 transform scale-95' : 'opacity-100'
            }`}>
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
                    disabled={isCompleting}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary-hover rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCompleting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {isCompleting ? 'Completing...' : 'Complete Now'}
                </button>
            </div>
        </div>
    );
}

