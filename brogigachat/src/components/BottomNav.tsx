'use client';

import { Target, Trophy, User } from 'lucide-react';

interface BottomNavProps {
    currentScreen: 'home' | 'leaderboard' | 'profile';
    onNavigate: (screen: 'home' | 'leaderboard' | 'profile') => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
    const navItems = [
        { id: 'home' as const, icon: Target, label: 'Tasks' },
        { id: 'leaderboard' as const, icon: Trophy, label: 'Ranks' },
        { id: 'profile' as const, icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-800 z-40">
            <div className="max-w-md mx-auto grid grid-cols-3 gap-1 p-2">
                {navItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => onNavigate(id)}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${currentScreen === id
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:text-white hover:bg-surface-alt'
                            }`}
                    >
                        <Icon size={24} />
                        <span className="text-xs">{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
