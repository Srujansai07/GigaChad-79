'use client';

import { useState } from 'react';
import { Plus, Repeat } from 'lucide-react';
import HabitTracker from '@/components/habits/HabitTracker';
import AddHabitModal from '@/components/habits/AddHabitModal';
import BottomNav from '@/components/BottomNav';

export default function Habits() {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Repeat className="text-primary" />
                        Habits
                    </h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-2 bg-primary hover:bg-primary-hover rounded-lg text-white transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <p className="text-gray-400 text-sm">Consistency is the key to greatness.</p>
            </div>

            <div className="p-4">
                <HabitTracker />
            </div>

            {showAddModal && <AddHabitModal onClose={() => setShowAddModal(false)} />}

            <BottomNav currentScreen="habits" />
        </div>
    );
}
