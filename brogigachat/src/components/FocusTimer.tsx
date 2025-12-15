'use client';

import { useState, useEffect } from 'react';
import { Clock, Target, Zap, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';

interface FocusTimerProps {
    duration?: number; // in minutes, default 25
    onComplete?: (auraEarned: number) => void;
}

export default function FocusTimer({ duration = 25, onComplete }: FocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessions] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            setSessions((prev) => prev + 1);
            const auraEarned = Math.floor(duration * 10); // 10 aura per minute
            onComplete?.(auraEarned);
            // Reset for next session
            setTimeLeft(duration * 60);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft, duration, onComplete]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(duration * 60);
    };

    return (
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Target size={20} className="text-primary" />
                    Focus Session
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap size={14} className="text-aura" />
                    <span>+{Math.floor(duration * 10)} aura</span>
                </div>
            </div>

            {/* Timer Display */}
            <div className="relative flex items-center justify-center mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-800"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="100%" stopColor="#EAB308" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">{formatTime(timeLeft)}</span>
                    <span className="text-sm text-gray-400">
                        {isRunning ? 'Grinding...' : 'Ready to focus'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={resetTimer}
                    className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
                <button
                    onClick={toggleTimer}
                    className={`p-4 rounded-full text-white ${isRunning ? 'bg-warning' : 'bg-primary'
                        } hover:opacity-90 transition-opacity`}
                >
                    {isRunning ? <Pause size={24} /> : <Play size={24} />}
                </button>
            </div>

            {/* Sessions Counter */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                <TrendingUp size={14} />
                <span>{sessionsCompleted} sessions today</span>
            </div>
        </div>
    );
}
