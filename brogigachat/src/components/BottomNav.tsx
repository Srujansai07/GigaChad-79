'use client';

import { Target, Trophy, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BottomNavProps {
    currentScreen?: 'home' | 'leaderboard' | 'profile';
    onNavigate?: (screen: 'home' | 'leaderboard' | 'profile') => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
    const router = useRouter();

    const navItems = [
        { id: 'home' as const, icon: Target, label: 'Tasks', path: '/' },
        { id: 'leaderboard' as const, icon: Trophy, label: 'Ranks', path: '/leaderboard' },
        { id: 'profile' as const, icon: User, label: 'Profile', path: '/profile' },
    ];

    const handleNavigate = (id: 'home' | 'leaderboard' | 'profile', path: string) => {
        if (onNavigate) {
            onNavigate(id);
        } else {
            router.push(path);
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-800 z-40">
            <div className="max-w-md mx-auto grid grid-cols-3 gap-1 p-2">
                {navItems.map(({ id, icon: Icon, label, path }) => (
                    <button
                        key={id}
                        onClick={() => handleNavigate(id, path)}
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

