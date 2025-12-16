'use client';

import React, { useState } from 'react';
import { X, Loader2, LogIn } from 'lucide-react';
import { useSquadStore } from '@/stores/squadStore';

interface JoinSquadModalProps {
    onClose: () => void;
}

export default function JoinSquadModal({ onClose }: JoinSquadModalProps) {
    const { joinSquad } = useSquadStore();
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            await joinSquad(code);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to join squad');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <LogIn className="text-primary" size={24} />
                        Join Squad
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Squad Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="e.g. X7K9P2"
                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase tracking-widest text-center font-mono text-xl"
                            required
                            maxLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Ask your squad leader for the 6-character invite code.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !code.trim()}
                            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Join Squad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
