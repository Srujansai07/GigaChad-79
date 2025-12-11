'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';

export default function StrictModeOverlay() {
    const { strictModeActive, strictModeTask, completeTask, deactivateStrictMode } = useTaskStore();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!strictModeActive) {
            setCountdown(3);
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

    if (!strictModeActive || !strictModeTask) return null;

    return (
        <div className="fixed inset-0 bg-danger z-[100] flex flex-col items-center justify-center p-6 animate-pulse-fast">
            {/* Warning Icon */}
            <div className="mb-6 animate-bounce">
                <AlertTriangle size={80} className="text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-white text-center mb-4 animate-shake">
                STRICT MODE ACTIVATED
            </h1>

            {/* Message */}
            <div className="text-center space-y-2 mb-8">
                <p className="text-xl text-white/90">
                    &quot;You&apos;ve skipped 3 times.&quot;
                </p>
                <p className="text-xl text-white/90">
                    &quot;No more excuses.&quot;
                </p>
                <p className="text-xl text-white font-bold">
                    &quot;DO THE WORK NOW.&quot;
                </p>
            </div>

            {/* Task Info */}
            <div className="bg-white/10 rounded-xl p-4 mb-8 w-full max-w-sm text-center">
                <p className="text-white/60 text-sm mb-1">Forcing you to:</p>
                <p className="text-xl font-bold text-white">{strictModeTask.title}</p>
                <p className="text-white/60 text-sm mt-1">{strictModeTask.app}</p>
            </div>

            {/* Countdown */}
            <div className="text-center">
                <div className="text-8xl font-black text-white mb-2">{countdown}</div>
                <p className="text-white/60">
                    {countdown > 0 ? 'Auto-completing in...' : 'Task complete!'}
                </p>
            </div>

            {/* Footer Message */}
            <p className="absolute bottom-8 text-white/40 text-sm text-center">
                Don&apos;t try to exit. You said you would do this. Now do it.
            </p>
        </div>
    );
}
