'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import Onboarding from '@/components/Onboarding';
import dynamic from 'next/dynamic';
import Skeleton from '@/components/Skeleton';
import BottomNav from '@/components/BottomNav';
import NotificationCard from '@/components/NotificationCard';
import StrictModeOverlay from '@/components/StrictModeOverlay';
import AICoach from '@/components/AICoach';

// Lazy Load Components
const Squads = dynamic(() => import('@/components/Squads'), { loading: () => <ScreenSkeleton /> });
const Habits = dynamic(() => import('@/components/Habits'), { loading: () => <ScreenSkeleton /> });
const Challenges = dynamic(() => import('@/components/Challenges'), { loading: () => <ScreenSkeleton /> });
const Shop = dynamic(() => import('@/components/Shop'), { loading: () => <ScreenSkeleton /> });
const Analytics = dynamic(() => import('@/components/Analytics'), { loading: () => <ScreenSkeleton /> });
const Leaderboard = dynamic(() => import('@/components/Leaderboard'), { loading: () => <ScreenSkeleton /> });
const Profile = dynamic(() => import('@/components/Profile'), { loading: () => <ScreenSkeleton /> });
// HomeScreen is critical, keep it eager or lazy with high priority? Let's lazy load it too for consistency but it's the default.
const HomeScreen = dynamic(() => import('@/components/HomeScreen'), { loading: () => <ScreenSkeleton /> });

// Reusable Screen Skeleton
const ScreenSkeleton = () => (
    <div className="p-4 space-y-4 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <Skeleton width={150} height={32} />
            <Skeleton width={40} height={40} variant="circular" />
        </div>
        <div className="space-y-3">
            <Skeleton height={100} />
            <Skeleton height={80} />
            <Skeleton height={80} />
        </div>
    </div>
);

export default function Home() {
    const { user, isOnboarded, loadUser } = useUserStore();
    const { loadTasks } = useTaskStore();
    const [currentScreen, setCurrentScreen] = useState<'home' | 'leaderboard' | 'profile' | 'squads' | 'habits' | 'challenges' | 'shop' | 'analytics'>('home');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load persisted data on mount
        loadUser();
        loadTasks();
        setIsLoading(false);
    }, [loadUser, loadTasks]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-4 max-w-md mx-auto space-y-4">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-6">
                    <Skeleton width={150} height={32} />
                    <Skeleton width={40} height={40} variant="circular" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton height={100} />
                    <Skeleton height={100} />
                </div>

                {/* List Skeleton */}
                <div className="space-y-3 mt-8">
                    <Skeleton height={24} width={100} />
                    <Skeleton height={80} />
                    <Skeleton height={80} />
                    <Skeleton height={80} />
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
            <AICoach />

            {/* Main Content */}
            <div className="max-w-md mx-auto">
                {currentScreen === 'home' && <HomeScreen />}
                {currentScreen === 'habits' && <Habits />}
                {currentScreen === 'challenges' && <Challenges />}
                {currentScreen === 'shop' && <Shop />}
                {currentScreen === 'analytics' && <Analytics />}
                {currentScreen === 'leaderboard' && <Leaderboard />}
                {currentScreen === 'squads' && <Squads />}
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
