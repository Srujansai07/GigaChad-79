'use client';

import React, { useState } from 'react';
import { X, Loader2, Target } from 'lucide-react';
import { useGoalStore } from '@/stores/goalStore';

interface AddGoalModalProps {
    onClose: () => void;
}

export default function AddGoalModal({ onClose }: AddGoalModalProps) {
    const { addGoal } = useGoalStore();
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState('');
    const [unit, setUnit] = useState('tasks');
    const [deadline, setDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !target) return;

        setIsLoading(true);
        setError(null);

        try {
            await addGoal({
                title,
                target: parseInt(target),
                unit,
                deadline: deadline ? new Date(deadline).toISOString() : null,
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create goal');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target className="text-primary" />
                        New Goal
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Goal Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Read 50 Books"
                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Target Value</label>
                            <input
                                type="number"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder="50"
                                className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="tasks">Tasks</option>
                                <option value="books">Books</option>
                                <option value="pages">Pages</option>
                                <option value="hours">Hours</option>
                                <option value="dollars">Dollars</option>
                                <option value="kg">Kg</option>
                                <option value="lbs">Lbs</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Deadline (Optional)</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !title.trim() || !target}
                        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Create Goal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
