'use client';

import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { BadgeRule } from '@/lib/gamification/badgeRules';

interface BadgeNotificationProps {
    badge: BadgeRule;
    onClose: () => void;
}

export default function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-[100] pointer-events-none transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-surface border border-yellow-500/50 p-6 rounded-2xl shadow-2xl shadow-yellow-500/20 transform scale-100 animate-bounce-in pointer-events-auto max-w-sm w-full mx-4 text-center relative overflow-hidden">

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shine" />

                <button
                    onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                    className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full text-gray-400"
                >
                    <X size={16} />
                </button>

                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-4xl border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                        {badge.emoji}
                    </div>
                </div>

                <h3 className="text-yellow-500 font-bold tracking-wider text-sm uppercase mb-1">Badge Unlocked!</h3>
                <h2 className="text-2xl font-bold text-white mb-2">{badge.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{badge.description}</p>

                <div className="inline-flex items-center gap-2 bg-surface-alt px-3 py-1.5 rounded-lg border border-white/10">
                    <Trophy size={14} className="text-yellow-500" />
                    <span className="text-yellow-500 font-bold">+{badge.auraReward} Aura</span>
                </div>
            </div>
        </div>
    );
}
