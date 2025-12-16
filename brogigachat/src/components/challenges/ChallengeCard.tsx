'use client';

import React, { useState } from 'react';
import { Trophy, Users, Clock, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Challenge } from '@/types';
import { useChallengeStore } from '@/stores/challengeStore';

interface ChallengeCardProps {
    challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
    const { joinChallenge, updateProgress } = useChallengeStore();
    const [isLoading, setIsLoading] = useState(false);
    const [progressInput, setProgressInput] = useState(challenge.progress?.toString() || '0');

    const handleJoin = async () => {
        setIsLoading(true);
        try {
            await joinChallenge(challenge.id);
        } catch (error) {
            console.error('Failed to join challenge', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        const val = parseInt(progressInput);
        if (isNaN(val)) return;

        setIsLoading(true);
        try {
            await updateProgress(challenge.id, val);
        } catch (error) {
            console.error('Failed to update progress', error);
        } finally {
            setIsLoading(false);
        }
    };

    const percentage = Math.min(100, Math.round(((challenge.progress || 0) / challenge.goal) * 100));
    const timeLeft = new Date(challenge.endsAt).getTime() - new Date().getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-4 relative overflow-hidden">
            {/* Background Gradient for Active/Joined */}
            {challenge.joined && !challenge.completed && (
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            )}
            {challenge.completed && (
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            )}

            <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                    <h3 className="font-bold text-white text-lg">{challenge.name}</h3>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-1 bg-surface-alt px-2 py-1 rounded-lg border border-white/5">
                    <Trophy size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">{challenge.reward}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pl-2">
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{daysLeft} days left</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{challenge.participants || 0} joined</span>
                </div>
            </div>

            {/* Action Area */}
            <div className="pl-2">
                {!challenge.joined ? (
                    <button
                        onClick={handleJoin}
                        disabled={isLoading}
                        className="w-full py-2 bg-primary hover:bg-primary-hover rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Accept Challenge'}
                    </button>
                ) : (
                    <div className="space-y-3">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{challenge.progress || 0} / {challenge.goal}</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${challenge.completed ? 'bg-green-500' : 'bg-primary'
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Update Controls */}
                        {!challenge.completed ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={progressInput}
                                    onChange={(e) => setProgressInput(e.target.value)}
                                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-primary"
                                    placeholder="Current value..."
                                />
                                <button
                                    onClick={handleUpdate}
                                    disabled={isLoading}
                                    className="p-2 bg-surface-alt hover:bg-white/10 rounded-lg text-primary transition-colors"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                                </button>
                            </div>
                        ) : (
                            <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center gap-2 text-green-400 font-bold text-sm">
                                <CheckCircle2 size={16} />
                                Challenge Completed!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
