'use client';

import { useEffect, useState } from 'react';
import { Users, Plus, LogIn, Loader2 } from 'lucide-react';
import { useSquadStore } from '@/stores/squadStore';
import CreateSquadModal from '@/components/squads/CreateSquadModal';
import JoinSquadModal from '@/components/squads/JoinSquadModal';
import SquadDashboard from '@/components/squads/SquadDashboard';
import BottomNav from '@/components/BottomNav';

export default function Squads() {
    const { squad, isLoading, fetchSquad } = useSquadStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    useEffect(() => {
        fetchSquad();
    }, [fetchSquad]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (squad) {
        return <SquadDashboard />;
    }

    return (
        <div className="min-h-screen bg-background pb-24 p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-primary" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Join the Brotherhood</h1>
                <p className="text-gray-400">
                    Squad up with other GigaChads. Compete, chat, and hold each other accountable.
                </p>
            </div>

            <div className="space-y-4 w-full max-w-sm">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full py-4 bg-primary hover:bg-primary-hover rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                    <Plus size={20} />
                    Create a Squad
                </button>

                <button
                    onClick={() => setShowJoinModal(true)}
                    className="w-full py-4 bg-surface hover:bg-surface-alt border border-white/10 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                    <LogIn size={20} />
                    Join with Code
                </button>
            </div>

            {showCreateModal && <CreateSquadModal onClose={() => setShowCreateModal(false)} />}
            {showJoinModal && <JoinSquadModal onClose={() => setShowJoinModal(false)} />}

            <BottomNav currentScreen="squads" />
        </div>
    );
}
