'use client';

import { useEffect } from 'react';
import { Swords, Loader2 } from 'lucide-react';
import { useChallengeStore } from '@/stores/challengeStore';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import BottomNav from '@/components/BottomNav';

export default function Challenges() {
    const { challenges, isLoading, fetchChallenges } = useChallengeStore();

    useEffect(() => {
        fetchChallenges();
    }, [fetchChallenges]);

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Swords className="text-primary" />
                        Challenges
                    </h1>
                </div>
                <p className="text-gray-400 text-sm">Prove your worth. Earn glory.</p>
            </div>

            <div className="p-4">
                {isLoading && challenges.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-white/5 rounded-xl bg-surface/50">
                        <p>No active challenges right now.</p>
                        <p className="text-sm mt-2">Check back later!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {challenges.map((challenge) => (
                            <ChallengeCard key={challenge.id} challenge={challenge} />
                        ))}
                    </div>
                )}
            </div>

            <BottomNav currentScreen="challenges" />
        </div>
    );
}
