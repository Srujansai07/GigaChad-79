'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';

interface Habit {
    id: string;
    name: string;
    frequency: 'daily' | 'weekly';
    streak: number;
    completedToday: boolean;
    bestStreak: number;
    auraPerComplete: number;
}

const SAMPLE_HABITS: Habit[] = [
    { id: '1', name: 'Morning Workout', frequency: 'daily', streak: 7, completedToday: true, bestStreak: 14, auraPerComplete: 100 },
    { id: '2', name: 'Read 30 min', frequency: 'daily', streak: 5, completedToday: false, bestStreak: 21, auraPerComplete: 75 },
    { id: '3', name: 'No Social Media', frequency: 'daily', streak: 3, completedToday: true, bestStreak: 7, auraPerComplete: 50 },
    { id: '4', name: 'Weekly Review', frequency: 'weekly', streak: 4, completedToday: false, bestStreak: 8, auraPerComplete: 200 },
];

export default function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>(SAMPLE_HABITS);
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleHabit = (habitId: string) => {
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                return {
                    ...h,
                    completedToday: !h.completedToday,
                    streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1),
                };
            }
            return h;
        }));
    };

    const completedCount = habits.filter(h => h.completedToday).length;
    const completionRate = Math.round((completedCount / habits.length) * 100);

    return (
        <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="text-2xl">🎯</div>
                    <div className="text-left">
                        <h3 className="font-bold text-white">Daily Habits</h3>
                        <p className="text-sm text-gray-400">{completedCount}/{habits.length} completed</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${completionRate >= 80 ? 'bg-success/20 text-success' :
                            completionRate >= 50 ? 'bg-warning/20 text-warning' :
                                'bg-danger/20 text-danger'
                        }`}>
                        {completionRate}%
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {/* Habits List */}
            {isExpanded && (
                <div className="border-t border-gray-800">
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="p-4 border-b border-gray-800 last:border-b-0 flex items-center gap-3"
                        >
                            <button
                                onClick={() => toggleHabit(habit.id)}
                                className={`p-1 rounded-full transition-colors ${habit.completedToday ? 'text-success' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {habit.completedToday ? (
                                    <CheckCircle size={24} />
                                ) : (
                                    <Circle size={24} />
                                )}
                            </button>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${habit.completedToday ? 'text-gray-400 line-through' : 'text-white'}`}>
                                        {habit.name}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
                                        {habit.frequency}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="text-streak">🔥</span>
                                        {habit.streak} day streak
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-aura">⚡</span>
                                        +{habit.auraPerComplete} aura
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
