'use client';

import React, { useState } from 'react';
import { Target, Trash2, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Goal } from '@/types';
import { useGoalStore } from '@/stores/goalStore';

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
    const { updateProgress, deleteGoal } = useGoalStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [newValue, setNewValue] = useState(goal.current.toString());

    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));

    const handleUpdate = async () => {
        const val = parseInt(newValue);
        if (isNaN(val)) return;

        setIsUpdating(true);
        try {
            await updateProgress(goal.id, val);
        } catch (error) {
            console.error('Failed to update progress', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(goal.id);
        }
    };

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-4 relative group">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        {goal.completed && <CheckCircle2 className="text-primary" size={18} />}
                        {goal.title}
                    </h3>
                    {goal.deadline && (
                        <p className="text-xs text-gray-400 mt-1">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{percentage}%</span>
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${goal.completed ? 'bg-primary' : 'bg-blue-500'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Update Controls */}
            {!goal.completed && (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-24 focus:outline-none focus:border-primary"
                    />
                    <button
                        onClick={handleUpdate}
                        disabled={isUpdating || parseInt(newValue) === goal.current}
                        className="p-2 bg-surface-alt hover:bg-white/10 rounded-lg text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            )}

            {goal.completed && (
                <div className="text-sm text-primary font-bold flex items-center gap-1">
                    <Target size={16} />
                    Goal Achieved! (+{goal.auraReward} Aura)
                </div>
            )}
        </div>
    );
}
