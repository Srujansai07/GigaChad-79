'use client';

import { useState } from 'react';
import { Target, Plus, Check, Trash2, Calendar, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: Date | null;
    auraReward: number;
    completed: boolean;
}

const SAMPLE_GOALS: Goal[] = [
    { id: '1', title: 'Complete 100 tasks', target: 100, current: 67, unit: 'tasks', deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), auraReward: 5000, completed: false },
    { id: '2', title: 'Maintain 30-day streak', target: 30, current: 12, unit: 'days', deadline: null, auraReward: 3000, completed: false },
    { id: '3', title: 'Earn 10,000 aura', target: 10000, current: 10000, unit: 'aura', deadline: null, auraReward: 1000, completed: true },
];

export default function GoalSetter() {
    const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    return (
        <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <Target size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white">Goals</h3>
                        <p className="text-sm text-gray-400">{activeGoals.length} active, {completedGoals.length} completed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowAddGoal(true); }}
                        className="p-2 bg-primary rounded-lg text-white"
                    >
                        <Plus size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </button>

            {/* Goals List */}
            {isExpanded && (
                <div className="border-t border-gray-800">
                    {activeGoals.map((goal) => (
                        <div key={goal.id} className="p-4 border-b border-gray-800 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-medium text-white">{goal.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                        {goal.deadline && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {goal.deadline.toLocaleDateString()}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-aura">
                                            <Zap size={12} />
                                            +{goal.auraReward}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteGoal(goal.id)}
                                    className="p-1 text-gray-500 hover:text-danger"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Progress */}
                            <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">{goal.current}/{goal.target} {goal.unit}</span>
                                    <span className="text-white">{Math.round((goal.current / goal.target) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-aura rounded-full transition-all"
                                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Completed Section */}
                    {completedGoals.length > 0 && (
                        <div className="p-4 bg-gray-800/30">
                            <p className="text-xs text-gray-500 mb-2">COMPLETED</p>
                            {completedGoals.map((goal) => (
                                <div key={goal.id} className="flex items-center gap-2 text-sm text-gray-400 py-1">
                                    <Check size={14} className="text-success" />
                                    <span className="line-through">{goal.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Goal Modal */}
            {showAddGoal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
                    <div className="w-full bg-surface rounded-t-3xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Set New Goal</h2>
                        <input
                            type="text"
                            placeholder="Goal title..."
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4"
                        />
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <input
                                type="number"
                                placeholder="Target"
                                className="bg-gray-800 text-white rounded-lg px-4 py-3"
                            />
                            <input
                                type="text"
                                placeholder="Unit (tasks, days...)"
                                className="bg-gray-800 text-white rounded-lg px-4 py-3"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddGoal(false)}
                                className="flex-1 py-3 bg-gray-700 rounded-lg text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowAddGoal(false)}
                                className="flex-1 py-3 bg-primary rounded-lg text-white font-medium"
                            >
                                Create Goal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
