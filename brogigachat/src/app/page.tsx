'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import Onboarding from '@/components/Onboarding';
import HomeScreen from '@/components/HomeScreen';
import Leaderboard from '@/components/Leaderboard';
import Profile from '@/components/Profile';
import BottomNav from '@/components/BottomNav';
import NotificationCard from '@/components/NotificationCard';
import StrictModeOverlay from '@/components/StrictModeOverlay';

export default function Home() {
    const { user, isOnboarded, loadUser } = useUserStore();
    const { loadTasks } = useTaskStore();
    const [currentScreen, setCurrentScreen] = useState<'home' | 'leaderboard' | 'profile'>('home');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load persisted data on mount
        loadUser();
        loadTasks();
        setIsLoading(false);
    }, [loadUser, loadTasks]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl animate-pulse">🔥</div>
                    <p className="text-gray-400 mt-2">Loading your grind...</p>
                </div>
            </div>
        );
    }

    if (!isOnboarded) {
        return <Onboarding />;
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Active Notification Overlay */}
            <NotificationCard />

            {/* Strict Mode Full-screen Overlay */}
            <StrictModeOverlay />

            {/* Main Content */}
            <div className="max-w-md mx-auto">
                {currentScreen === 'home' && <HomeScreen />}
                {currentScreen === 'leaderboard' && <Leaderboard />}
                {currentScreen === 'profile' && <Profile />}
            </div>

            {/* Bottom Navigation */}
            <BottomNav
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
            />
        </main>
    );
}
