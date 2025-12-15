'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Flame, Zap, Clock } from 'lucide-react';

interface DailyStatsCardProps {
    stats: {
        tasksCompleted: number;
        tasksTotal: number;
        auraGained: number;
        auraLost: number;
        streak: number;
        focusMinutes: number;
        strictModeCount: number;
    };
    previousStats?: {
        tasksCompleted: number;
        auraGained: number;
    };
}

export default function DailyStatsCard({ stats, previousStats }: DailyStatsCardProps) {
    const completionRate = useMemo(() => {
        if (stats.tasksTotal === 0) return 0;
        return Math.round((stats.tasksCompleted / stats.tasksTotal) * 100);
    }, [stats.tasksCompleted, stats.tasksTotal]);

    const netAura = stats.auraGained - stats.auraLost;

    const tasksTrend = previousStats
        ? stats.tasksCompleted - previousStats.tasksCompleted
        : 0;

    const auraTrend = previousStats
        ? stats.auraGained - previousStats.auraGained
        : 0;

    const statItems = [
        {
            icon: Target,
            label: 'Tasks',
            value: `${stats.tasksCompleted}/${stats.tasksTotal}`,
            subValue: `${completionRate}%`,
            trend: tasksTrend,
            color: 'text-primary',
        },
        {
            icon: Zap,
            label: 'Aura',
            value: netAura >= 0 ? `+${netAura}` : `${netAura}`,
            subValue: `${stats.auraGained} earned`,
            trend: auraTrend,
            color: netAura >= 0 ? 'text-aura' : 'text-danger',
        },
        {
            icon: Flame,
            label: 'Streak',
            value: `${stats.streak}`,
            subValue: 'days',
            color: 'text-streak',
        },
        {
            icon: Clock,
            label: 'Focus',
            value: `${stats.focusMinutes}`,
            subValue: 'min',
            color: 'text-success',
        },
    ];

    return (
        <div className="bg-surface rounded-xl border border-gray-800 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Today's Stats</h3>

            <div className="grid grid-cols-2 gap-4">
                {statItems.map((item) => (
                    <div key={item.label} className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <item.icon size={14} className={item.color} />
                            <span className="text-xs text-gray-500">{item.label}</span>
                            {item.trend !== undefined && item.trend !== 0 && (
                                <span className={`text-xs flex items-center ${item.trend > 0 ? 'text-success' : 'text-danger'}`}>
                                    {item.trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {Math.abs(item.trend)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                            <span className="text-xs text-gray-500">{item.subValue}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strict Mode Badge */}
            {stats.strictModeCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Strict Mode Sessions</span>
                    <span className="px-2 py-1 bg-danger/20 text-danger rounded-full text-sm font-bold">
                        🔒 {stats.strictModeCount}
                    </span>
                </div>
            )}

            {/* Motivational Message */}
            <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-center text-sm">
                    {completionRate >= 90 ? (
                        <span className="text-success">🔥 Crushing it today! Keep going!</span>
                    ) : completionRate >= 70 ? (
                        <span className="text-aura">💪 Solid progress! Finish strong!</span>
                    ) : completionRate >= 50 ? (
                        <span className="text-warning">⚡ Halfway there! Push harder!</span>
                    ) : (
                        <span className="text-gray-400">🎯 Let's get those tasks done!</span>
                    )}
                </p>
            </div>
        </div>
    );
}
