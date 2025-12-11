'use client';

import { useState } from 'react';
import { Plus, Target, CheckCircle, Circle, TrendingUp, Calendar } from 'lucide-react';
import HabitTracker from '@/components/HabitTracker';
import WeeklyInsights from '@/components/WeeklyInsights';

export default function HabitsPage() {
    const [showAddHabit, setShowAddHabit] = useState(false);

    return (
        <main className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Daily Habits</h1>
                        <p className="text-sm text-gray-400">Build discipline, one day at a time</p>
                    </div>
                    <button
                        onClick={() => setShowAddHabit(true)}
                        className="p-3 bg-primary rounded-xl text-white"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Weekly Overview */}
                <div className="bg-surface rounded-xl p-4 border border-gray-800 mb-6">
                    <h3 className="font-medium text-white mb-3">This Week</h3>
                    <div className="flex justify-between">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                            const isToday = index === new Date().getDay() - 1;
                            const isCompleted = index < new Date().getDay() - 1;
                            return (
                                <div key={index} className="text-center">
                                    <span className="text-xs text-gray-500 block mb-2">{day}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isToday
                                            ? 'bg-primary text-white'
                                            : isCompleted
                                                ? 'bg-success/20 text-success'
                                                : 'bg-gray-800 text-gray-500'
                                        }`}>
                                        {isCompleted ? (
                                            <CheckCircle size={16} />
                                        ) : (
                                            <Circle size={16} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Habit Tracker */}
                <HabitTracker />

                {/* Weekly Insights */}
                <div className="mt-6">
                    <WeeklyInsights />
                </div>

                {/* Add Habit Modal */}
                {showAddHabit && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
                        <div className="w-full bg-surface rounded-t-3xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Add New Habit</h2>
                            <input
                                type="text"
                                placeholder="Habit name..."
                                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4"
                            />
                            <div className="flex gap-2 mb-4">
                                <button className="flex-1 py-3 bg-gray-800 rounded-lg text-white">Daily</button>
                                <button className="flex-1 py-3 bg-gray-700 rounded-lg text-gray-400">Weekly</button>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddHabit(false)}
                                    className="flex-1 py-3 bg-gray-700 rounded-lg text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowAddHabit(false)}
                                    className="flex-1 py-3 bg-primary rounded-lg text-white font-medium"
                                >
                                    Add Habit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
