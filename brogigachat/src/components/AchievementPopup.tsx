'use client';

import { useEffect, useState } from 'react';
import { Star, Award, Flame, TrendingUp, X } from 'lucide-react';

interface Achievement {
    id: string;
    type: 'badge' | 'level' | 'streak' | 'aura';
    title: string;
    description: string;
    emoji: string;
    reward?: number;
}

interface AchievementPopupProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export default function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (achievement) {
            // Trigger animation
            setTimeout(() => setShow(true), 50);

            // Auto close after 4 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [achievement]);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    };

    if (!achievement) return null;

    const getGradient = () => {
        switch (achievement.type) {
            case 'badge': return 'from-purple-600 to-pink-600';
            case 'level': return 'from-yellow-500 to-orange-500';
            case 'streak': return 'from-orange-500 to-red-500';
            case 'aura': return 'from-blue-500 to-purple-500';
            default: return 'from-primary to-red-600';
        }
    };

    const getIcon = () => {
        switch (achievement.type) {
            case 'badge': return Award;
            case 'level': return TrendingUp;
            case 'streak': return Flame;
            case 'aura': return Star;
            default: return Star;
        }
    };

    const Icon = getIcon();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <div
                className={`relative bg-gradient-to-br ${getGradient()} rounded-2xl p-6 max-w-sm w-full shadow-2xl pointer-events-auto transition-all duration-300 ${show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                    }`}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                    <X size={16} className="text-white" />
                </button>

                {/* Confetti effect bg */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="absolute top-2 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute bottom-4 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-1/3 right-8 w-1 h-1 bg-yellow-200 rounded-full animate-ping" />
                </div>

                {/* Content */}
                <div className="relative text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-2xl mb-4 animate-bounce">
                        <span className="text-5xl">{achievement.emoji}</span>
                    </div>

                    {/* Title */}
                    <p className="text-white/70 text-sm uppercase tracking-wide mb-1">
                        {achievement.type === 'badge' && 'New Badge Unlocked!'}
                        {achievement.type === 'level' && 'Level Up!'}
                        {achievement.type === 'streak' && 'Streak Milestone!'}
                        {achievement.type === 'aura' && 'Aura Achievement!'}
                    </p>

                    <h2 className="text-2xl font-black text-white mb-2">{achievement.title}</h2>
                    <p className="text-white/80 text-sm mb-4">{achievement.description}</p>

                    {/* Reward */}
                    {achievement.reward && (
                        <div className="inline-flex items-center gap-1 px-4 py-2 bg-white/20 rounded-full text-white font-bold">
                            <Star size={16} className="text-yellow-300" />
                            +{achievement.reward} Aura
                        </div>
                    )}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl animate-shimmer" />
            </div>
        </div>
    );
}

// Hook to manage achievements
export function useAchievements() {
    const [queue, setQueue] = useState<Achievement[]>([]);
    const [current, setCurrent] = useState<Achievement | null>(null);

    const showAchievement = (achievement: Achievement) => {
        if (current) {
            setQueue((prev) => [...prev, achievement]);
        } else {
            setCurrent(achievement);
        }
    };

    const dismissCurrent = () => {
        setCurrent(null);
        if (queue.length > 0) {
            setTimeout(() => {
                setCurrent(queue[0]);
                setQueue((prev) => prev.slice(1));
            }, 300);
        }
    };

    return { current, showAchievement, dismissCurrent };
}
