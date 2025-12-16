'use client';

import { Target, Trophy, User, Users, Repeat, Swords, ShoppingBag, BarChart2, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BottomNavProps {
    currentScreen?: 'home' | 'leaderboard' | 'profile' | 'squads' | 'habits' | 'challenges' | 'shop' | 'analytics' | 'social' | 'settings';
    onNavigate?: (screen: 'home' | 'leaderboard' | 'profile' | 'squads' | 'habits' | 'challenges' | 'shop' | 'analytics' | 'social' | 'settings') => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
    const router = useRouter();

    const navItems = [
        { id: 'home' as const, icon: Target, label: 'Tasks', path: '/' },
        { id: 'habits' as const, icon: Repeat, label: 'Habits', path: '/habits' },
        { id: 'challenges' as const, icon: Swords, label: 'Challenges', path: '/challenges' },
        { id: 'shop' as const, icon: ShoppingBag, label: 'Shop', path: '/shop' },
        { id: 'analytics' as const, icon: BarChart2, label: 'Stats', path: '/analytics' },
        { id: 'social' as const, icon: Users, label: 'Social', path: '/social' },
        { id: 'leaderboard' as const, icon: Trophy, label: 'Ranks', path: '/leaderboard' },
        { id: 'settings' as const, icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleNavigate = (id: 'home' | 'leaderboard' | 'profile' | 'squads' | 'habits' | 'challenges' | 'shop' | 'analytics' | 'social' | 'settings', path: string) => {
        if (onNavigate) {
            onNavigate(id as any); // Type assertion for now as parent might not support all
        } else {
            router.push(path);
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-800 z-40">
            <div className="max-w-md mx-auto grid grid-cols-8 gap-1 p-2 overflow-x-auto">
                {navItems.map(({ id, icon: Icon, label, path }) => (
                    <button
                        key={id}
                        onClick={() => handleNavigate(id, path)}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300 min-w-[45px] ${currentScreen === id
                            ? 'bg-primary text-white transform scale-110 shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                            : 'text-gray-400 hover:text-white hover:bg-surface-alt hover:scale-105'
                            }`}
                    >
                        <Icon size={18} className={`transition-transform duration-300 ${currentScreen === id ? 'animate-bounce-subtle' : ''}`} />
                        <span className="text-[9px] font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
