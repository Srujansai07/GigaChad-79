'use client';

import { useEffect, useState } from 'react';
import { BarChart2, Loader2, TrendingUp, CheckCircle } from 'lucide-react';
import AuraChart from '@/components/analytics/AuraChart';
import TaskCompletionChart from '@/components/analytics/TaskCompletionChart';
import BottomNav from '@/components/BottomNav';

interface AnalyticsData {
    auraHistory: { date: string; amount: number }[];
    taskHistory: { date: string; count: number }[];
    habitStats: { completed: number; total: number };
}

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-6 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BarChart2 className="text-primary" />
                    Analytics
                </h1>
                <p className="text-gray-400 text-sm">Track your performance.</p>
            </div>

            <div className="p-4 space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : data ? (
                    <>
                        {/* Aura Growth */}
                        <div className="bg-surface border border-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="text-aura" size={20} />
                                <h2 className="font-bold text-white">Aura Growth (Last 7 Days)</h2>
                            </div>
                            <AuraChart data={data.auraHistory} />
                        </div>

                        {/* Task Completion */}
                        <div className="bg-surface border border-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="text-blue-500" size={20} />
                                <h2 className="font-bold text-white">Tasks Completed</h2>
                            </div>
                            <TaskCompletionChart data={data.taskHistory} />
                        </div>

                        {/* Habit Snapshot */}
                        <div className="bg-surface border border-white/5 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-white text-lg">Daily Habits</h2>
                                <p className="text-gray-400 text-sm">Completed today</p>
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {data.habitStats.completed} <span className="text-gray-500 text-lg">/ {data.habitStats.total}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">Failed to load data.</div>
                )}
            </div>

            <BottomNav currentScreen="analytics" />
        </div>
    );
}
