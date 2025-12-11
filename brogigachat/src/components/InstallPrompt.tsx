'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed
        const wasDismissed = localStorage.getItem('install-prompt-dismissed');
        if (wasDismissed) {
            setDismissed(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show after a delay to not interrupt user
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setDismissed(true);
        localStorage.setItem('install-prompt-dismissed', 'true');
    };

    if (!showPrompt || dismissed) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 bg-surface border border-gray-700 rounded-xl p-4 shadow-lg z-50 animate-slide-in">
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
            >
                <X size={16} />
            </button>

            <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Smartphone size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white">Install BroGigaChad</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Add to home screen for the full TopG experience
                    </p>
                    <button
                        onClick={handleInstall}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                    >
                        <Download size={16} />
                        Install App
                    </button>
                </div>
            </div>
        </div>
    );
}
