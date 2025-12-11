'use client';

import { useState } from 'react';
import { TrendingUp, Calendar, Zap, Target, Flame, Trophy, ChevronRight } from 'lucide-react';
import ProductivityHeatmap from '@/components/ProductivityHeatmap';
import WeeklyInsights from '@/components/WeeklyInsights';

export default function StatsPage() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

    const stats = {
        totalTasks: 247,
        completedTasks: 221,
        totalAura: 15420,
        currentStreak: 12,
        bestStreak: 21,
        averageDaily: 4.2,
    };

    const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100);

    return (
        <main className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Statistics</h1>
                        <p className="text-sm text-gray-400">Your productivity journey</p>
                    </div>
                    <div className="text-4xl">ðŸ“Š</div>
                </div>

                {/* Time Range Filter */}
                <div className="flex gap-2 mb-6">
                    {(['week', 'month', 'all'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-primary text-white'
                                    : 'bg-surface border border-gray-700 text-gray-400'
                                }`}
                        >
                            {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
                        </button>
                    ))}
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-surface rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 text-aura mb-2">
                            <Zap size={18} />
                            <span className="text-sm">Total Aura</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalAura.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 text-streak mb-2">
                            <Flame size={18} />
                            <span className="text-sm">Current Streak</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.currentStreak} days</p>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 text-success mb-2">
                            <Target size={18} />
                            <span className="text-sm">Completion Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{completionRate}%</p>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Calendar size={18} />
                            <span className="text-sm">Avg Daily</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.averageDaily} tasks</p>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="mb-6">
                    <ProductivityHeatmap />
                </div>

                {/* Weekly Insights */}
                <WeeklyInsights />

                {/* Achievements */}
                <div className="mt-6 bg-surface rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Recent Achievements</h3>
                        <button className="text-primary text-sm flex items-center gap-1">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { emoji: 'ðŸ”¥', name: 'Week Warrior', date: '2 days ago' },
                            { emoji: 'ðŸ’¯', name: 'Century Hustler', date: '1 week ago' },
                            { emoji: 'âš¡', name: 'Grinder Status', date: '2 weeks ago' },
                        ].map((achievement, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                                <span className="text-2xl">{achievement.emoji}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-white">{achievement.name}</p>
                                    <p className="text-xs text-gray-400">{achievement.date}</p>
                                </div>
                                <Trophy size={16} className="text-aura" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
