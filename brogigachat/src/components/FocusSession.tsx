'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { trackEvent } from '@/lib/analytics';

interface FocusSessionProps {
    onComplete?: (duration: number) => void;
}

type SessionType = 'work' | 'short_break' | 'long_break';

const SESSION_DURATIONS: Record<SessionType, number> = {
    work: 25 * 60, // 25 minutes
    short_break: 5 * 60, // 5 minutes
    long_break: 15 * 60, // 15 minutes
};

export default function FocusSession({ onComplete }: FocusSessionProps) {
    const { addAura } = useUserStore();
    const [sessionType, setSessionType] = useState<SessionType>('work');
    const [timeLeft, setTimeLeft] = useState(SESSION_DURATIONS.work);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Timer logic
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSessionComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleSessionComplete = useCallback(() => {
        setIsRunning(false);

        if (sessionType === 'work') {
            // Award aura for completing work session
            addAura(50);
            setSessionsCompleted((prev) => prev + 1);

            trackEvent({ type: 'task_completed', taskId: 'focus_session', aura: 50, duration: SESSION_DURATIONS.work, strictMode: false });

            // Every 4 work sessions, suggest long break
            if ((sessionsCompleted + 1) % 4 === 0) {
                setSessionType('long_break');
                setTimeLeft(SESSION_DURATIONS.long_break);
            } else {
                setSessionType('short_break');
                setTimeLeft(SESSION_DURATIONS.short_break);
            }
        } else {
            // After break, suggest work
            setSessionType('work');
            setTimeLeft(SESSION_DURATIONS.work);
        }

        // Notify
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Session Complete!', {
                body: sessionType === 'work' ? 'Time for a break!' : 'Ready to focus again?',
                icon: '/icon-192.png',
            });
        }

        onComplete?.(SESSION_DURATIONS[sessionType]);
    }, [sessionType, sessionsCompleted, addAura, onComplete]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((SESSION_DURATIONS[sessionType] - timeLeft) / SESSION_DURATIONS[sessionType]) * 100;

    const getSessionColor = () => {
        if (sessionType === 'work') return 'text-primary';
        if (sessionType === 'short_break') return 'text-success';
        return 'text-aura';
    };

    const handleStart = () => {
        setIsRunning(true);
        trackEvent({ type: 'session_start' });
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(SESSION_DURATIONS[sessionType]);
    };

    const handleSessionTypeChange = (type: SessionType) => {
        if (isRunning) return;
        setSessionType(type);
        setTimeLeft(SESSION_DURATIONS[type]);
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800">
            {/* Session Type Selector */}
            <div className="flex gap-2 mb-6">
                {(['work', 'short_break', 'long_break'] as SessionType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => handleSessionTypeChange(type)}
                        disabled={isRunning}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${sessionType === type
                                ? type === 'work' ? 'bg-primary text-white' : 'bg-success/20 text-success'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {type === 'work' && <Target size={14} className="inline mr-1" />}
                        {type === 'short_break' && <Coffee size={14} className="inline mr-1" />}
                        {type === 'long_break' && <Coffee size={14} className="inline mr-1" />}
                        {type === 'work' ? 'Focus' : type === 'short_break' ? 'Short' : 'Long'}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="relative mb-6">
                {/* Circular Progress */}
                <svg className="w-48 h-48 mx-auto -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-800"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                        className={`${getSessionColor()} transition-all duration-1000`}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-mono font-bold ${getSessionColor()}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-gray-500 text-sm mt-2">
                        {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={handleReset}
                    className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={isRunning ? handlePause : handleStart}
                    className={`p-5 rounded-full ${isRunning ? 'bg-gray-700' : 'bg-primary hover:bg-primary-hover'
                        } text-white transition-colors`}
                >
                    {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>

                <div className="p-3 rounded-full bg-gray-800">
                    <span className="text-gray-400 text-sm font-bold">{sessionsCompleted}</span>
                </div>
            </div>

            {/* Session Counter */}
            <p className="text-center text-gray-500 text-sm mt-4">
                {sessionsCompleted} sessions completed today â€¢ +{sessionsCompleted * 50} aura
            </p>
        </div>
    );
}
