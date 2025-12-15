'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import HomeScreen from '@/components/HomeScreen';
import Onboarding from '@/components/Onboarding';
import BottomNav from '@/components/BottomNav';
import StrictModeOverlay from '@/components/StrictModeOverlay';
import AddTaskModal from '@/components/AddTaskModal';
import OfflineIndicator from '@/components/OfflineIndicator';
import AchievementPopup, { useAchievements } from '@/components/AchievementPopup';
import { registerServiceWorker, initPWAInstallPrompt } from '@/lib/pwa';
import { startSession } from '@/lib/analytics';

export default function AppClient() {
    const { user, isOnboarded, completeOnboarding } = useUserStore();
    const { showAddModal, setShowAddModal } = useTaskStore();
    const { current: achievement, dismissCurrent } = useAchievements();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize app
        const init = async () => {
            // Register service worker
            await registerServiceWorker();

            // Initialize PWA install prompt
            initPWAInstallPrompt();

            // Start analytics session
            startSession();

            setLoading(false);
        };

        init();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-pulse">🔥</div>
                    <p className="text-gray-500">Loading BroGigaChad...</p>
                </div>
            </div>
        );
    }

    if (!isOnboarded) {
        return <Onboarding onComplete={completeOnboarding} />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* Main Content */}
            <HomeScreen />

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Modals */}
            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            {/* Strict Mode Overlay */}
            <StrictModeOverlay />

            {/* Achievement Popup */}
            <AchievementPopup
                achievement={achievement}
                onClose={dismissCurrent}
            />
        </div>
    );
}
