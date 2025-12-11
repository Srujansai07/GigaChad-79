'use client';

import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Lock, Clock, Flame } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';

const STRICT_MODE_STORAGE_KEY = 'bro-strict-mode-state';

interface StrictModeState {
    active: boolean;
    taskId: string | null;
    startTime: number;
    countdownSeconds: number;
}

export default function StrictModeOverlay() {
    const { strictModeActive, strictModeTask, completeTask, deactivateStrictMode } = useTaskStore();
    const { user } = useUserStore();
    const [countdown, setCountdown] = useState(30);
    const [pulseIntensity, setPulseIntensity] = useState(1);

    // Persist strict mode state to survive page refresh
    useEffect(() => {
        if (strictModeActive && strictModeTask) {
            const state: StrictModeState = {
                active: true,
                taskId: strictModeTask.id,
                startTime: Date.now(),
                countdownSeconds: countdown,
            };
            localStorage.setItem(STRICT_MODE_STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(STRICT_MODE_STORAGE_KEY);
        }
    }, [strictModeActive, strictModeTask, countdown]);

    // Restore strict mode state on mount
    useEffect(() => {
        const saved = localStorage.getItem(STRICT_MODE_STORAGE_KEY);
        if (saved) {
            const state: StrictModeState = JSON.parse(saved);
            if (state.active) {
                // Calculate remaining time
                const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
                const remaining = Math.max(0, state.countdownSeconds - elapsed);
                setCountdown(remaining);
            }
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!strictModeActive) {
            setCountdown(30);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Force complete the task
                    if (strictModeTask) {
                        completeTask(strictModeTask.id, true);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [strictModeActive, strictModeTask, completeTask]);

    // Increase pulse intensity as countdown decreases
    useEffect(() => {
        if (countdown <= 10) {
            setPulseIntensity(3);
        } else if (countdown <= 20) {
            setPulseIntensity(2);
        } else {
            setPulseIntensity(1);
        }
    }, [countdown]);

    // Block back button
    useEffect(() => {
        if (!strictModeActive) return;

        const handlePopState = (e: PopStateEvent) => {
            e.preventDefault();
            window.history.pushState(null, '', window.location.href);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [strictModeActive]);

    // Block page close/refresh with warning
    useEffect(() => {
        if (!strictModeActive) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Strict Mode is active! You must complete your task first.';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [strictModeActive]);

    // Handle manual completion
    const handleComplete = useCallback(() => {
        if (strictModeTask) {
            completeTask(strictModeTask.id, true);
        }
    }, [strictModeTask, completeTask]);

    if (!strictModeActive || !strictModeTask) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6"
            style={{
                background: `linear-gradient(135deg, 
          hsl(0, 90%, ${15 + (pulseIntensity * 5)}%) 0%, 
          hsl(0, 100%, ${5 + (pulseIntensity * 3)}%) 100%)`,
                animation: pulseIntensity === 3 ? 'pulse 0.3s ease-in-out infinite' :
                    pulseIntensity === 2 ? 'pulse 0.5s ease-in-out infinite' :
                        'pulse 1s ease-in-out infinite',
            }}
        >
            {/* Lock Icon */}
            <div className="absolute top-8 right-8 opacity-30">
                <Lock size={48} />
            </div>

            {/* Warning Icon */}
            <div className="mb-6 animate-bounce">
                <AlertTriangle size={80} className="text-white drop-shadow-2xl" />
            </div>

            {/* Title */}
            <h1
                className="text-4xl md:text-5xl font-black text-white text-center mb-4"
                style={{
                    textShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(255,0,0,0.4)',
                    animation: countdown <= 10 ? 'shake 0.5s ease-in-out infinite' : 'none',
                }}
            >
                STRICT MODE
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/90 text-center mb-2">
                You skipped 3 times. No more excuses.
            </p>
            <p className="text-lg text-white font-bold text-center mb-8">
                DO THE WORK. NOW.
            </p>

            {/* Task Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 w-full max-w-sm border border-white/20">
                <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <Flame size={16} />
                    Complete this task:
                </p>
                <p className="text-2xl font-bold text-white">{strictModeTask.title}</p>
                {strictModeTask.description && (
                    <p className="text-white/70 text-sm mt-2">{strictModeTask.description}</p>
                )}
                <p className="text-white/50 text-sm mt-2">{strictModeTask.app}</p>
            </div>

            {/* Countdown */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-white/60 mb-2">
                    <Clock size={20} />
                    <span>Auto-completing in</span>
                </div>
                <div
                    className="text-8xl font-black text-white tabular-nums"
                    style={{
                        textShadow: countdown <= 10 ? '0 0 30px rgba(255,255,255,0.8)' : 'none',
                    }}
                >
                    {countdown}
                </div>
            </div>

            {/* Complete Button */}
            <button
                onClick={handleComplete}
                className="w-full max-w-sm py-4 bg-white text-danger font-bold text-lg rounded-xl shadow-xl hover:scale-105 transition-transform"
            >
                ✅ I DID IT - COMPLETE NOW
            </button>

            {/* Message */}
            <p className="absolute bottom-8 text-white/40 text-sm text-center max-w-sm">
                This screen cannot be bypassed. The only way out is through.
                Your phone is your tool, not your master.
            </p>
        </div>
    );
}
