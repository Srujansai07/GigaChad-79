'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import { APP_OPTIONS } from '@/types';

interface AddTaskModalProps {
    onClose: () => void;
}

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
    const { addTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [app, setApp] = useState<string>(APP_OPTIONS[0]);
    const [scheduledFor, setScheduledFor] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title: title.trim(),
            description: description.trim(),
            app,
            baseAura: 100,
            scheduledFor: scheduledFor || new Date().toISOString(),
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add New Task</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-alt transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Task Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Post tweet about AI"
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional details..."
                            rows={2}
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* App Selection */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Target App</label>
                        <select
                            value={app}
                            onChange={(e) => setApp(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                            {APP_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Scheduled Time */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Schedule For</label>
                        <input
                            type="datetime-local"
                            value={scheduledFor}
                            onChange={(e) => setScheduledFor(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!title.trim()}
                        className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors"
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
}
