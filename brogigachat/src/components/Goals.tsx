'use client';

import { useEffect, useState } from 'react';
import { Plus, Target, Loader2 } from 'lucide-react';
import { useGoalStore } from '@/stores/goalStore';
import GoalCard from '@/components/goals/GoalCard';
import AddGoalModal from '@/components/goals/AddGoalModal';

export default function Goals() {
    const { goals, isLoading, fetchGoals } = useGoalStore();
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    if (isLoading && goals.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="text-primary" />
                    Long-term Goals
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="p-2 bg-primary hover:bg-primary-hover rounded-lg text-white transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border border-white/5 rounded-xl bg-surface/50">
                    <p>No goals set. Dream big!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            )}

            {showAddModal && <AddGoalModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
}
