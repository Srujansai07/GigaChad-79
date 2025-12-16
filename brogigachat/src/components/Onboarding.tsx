'use client';

import { useState } from 'react';
import { Flame, Target, Zap } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';

interface OnboardingProps {
    onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUsername: saveUsername, completeOnboarding } = useUserStore();
    const router = useRouter();

    const handleStart = async () => {
        if (username.trim().length < 2) return;

        setLoading(true);
        setError('');

        try {
            // Update user on server
            const response = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim() }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update username');
            }

            // Update local store
            saveUsername(username.trim());
            completeOnboarding();

            // Refresh to ensure server components update
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            {/* Logo */}
            <div className="text-6xl mb-4 animate-bounce-slow">🔥</div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
                BroGigaChad
            </h1>
            <p className="text-gray-400 text-center mb-8">
                Your Phone&apos;s New Strict Older Brother
            </p>

            {/* Features */}
            <div className="w-full max-w-sm space-y-4 mb-8">
                <div className="flex items-center gap-3 bg-surface p-4 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">One-Tap Action</p>
                        <p className="text-sm text-gray-400">Deep-link directly to your tasks</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-surface p-4 rounded-lg">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">Strict Mode</p>
                        <p className="text-sm text-gray-400">Skip 3 times? I take control.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-surface p-4 rounded-lg">
                    <div className="w-10 h-10 bg-aura/20 rounded-lg flex items-center justify-center">
                        <Flame className="w-5 h-5 text-aura" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">Aura Points</p>
                        <p className="text-sm text-gray-400">Earn status. Climb the ranks.</p>
                    </div>
                </div>
            </div>

            {/* Username Input */}
            <div className="w-full max-w-sm space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    disabled={loading}
                />

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    onClick={handleStart}
                    disabled={username.trim().length < 2 || loading}
                    className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-white text-lg transition-colors flex items-center justify-center"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "LET'S GO 🔥"
                    )}
                </button>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 mt-8">
                By continuing, you accept that excuses are not allowed.
            </p>
        </div>
    );
}

