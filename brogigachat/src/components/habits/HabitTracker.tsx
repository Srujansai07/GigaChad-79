'use client';

import React, { useEffect, useState } from 'react';
import { Check, Flame, Trash2, Plus, Loader2 } from 'lucide-react';
import { useHabitStore } from '@/stores/habitStore';
import { useUserStore } from '@/stores/userStore';

export default function HabitTracker() {
    const { habits, isLoading, fetchHabits, completeHabit, deleteHabit } = useHabitStore();
    const { user } = useUserStore();
    const [completingId, setCompletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    const handleComplete = async (id: string) => {
        setCompletingId(id);
        try {
            await completeHabit(id);
        } catch (error) {
            console.error('Failed to complete habit', error);
        } finally {
            setCompletingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this habit?')) {
            await deleteHabit(id);
        }
    };

    if (isLoading && habits.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (habits.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No habits yet. Start building your routine!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {habits.map((habit) => (
                <div
                    key={habit.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${habit.completedToday
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-surface border-white/5 hover:border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => !habit.completedToday && handleComplete(habit.id)}
                            disabled={habit.completedToday || completingId === habit.id}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${habit.completedToday
                                ? 'bg-primary border-primary text-white'
                                : 'bg-transparent border-gray-500 text-transparent hover:border-primary'
                                }`}
                        >
                            {completingId === habit.id ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <Check size={16} />
                            )}
                        </button>

                        <div>
                            <h3 className={`font-semibold ${habit.completedToday ? 'text-gray-400 line-through' : 'text-white'}`}>
                                {habit.name}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="uppercase tracking-wider">{habit.frequency}</span>
                                {habit.streak > 0 && (
                                    <span className="flex items-center gap-1 text-orange-400">
                                        <Flame size={12} fill="currentColor" />
                                        {habit.streak} day streak
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleDelete(habit.id)}
                        className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
}
