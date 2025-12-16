'use client';

import React, { useState } from 'react';
import { X, Loader2, Repeat } from 'lucide-react';
import { useHabitStore } from '@/stores/habitStore';

interface AddHabitModalProps {
    onClose: () => void;
}

export default function AddHabitModal({ onClose }: AddHabitModalProps) {
    const { addHabit } = useHabitStore();
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY'>('DAILY');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await addHabit(name, frequency);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create habit');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Repeat className="text-primary" />
                        New Habit
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Habit Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Read 10 pages, Cold Shower"
                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFrequency('DAILY')}
                                className={`p-3 rounded-xl border transition-all font-semibold ${frequency === 'DAILY'
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-background border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                            >
                                Daily
                            </button>
                            <button
                                type="button"
                                onClick={() => setFrequency('WEEKLY')}
                                className={`p-3 rounded-xl border transition-all font-semibold ${frequency === 'WEEKLY'
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-background border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                            >
                                Weekly
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Create Habit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
