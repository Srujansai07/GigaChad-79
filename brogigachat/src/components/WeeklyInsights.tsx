'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Target, Flame, Clock } from 'lucide-react';

interface WeeklyInsight {
    type: 'improvement' | 'decline' | 'neutral';
    metric: string;
    value: string;
    comparison: string;
    icon: React.ReactNode;
}

export default function WeeklyInsights() {
    const [insights, setInsights] = useState<WeeklyInsight[]>([]);

    useEffect(() => {
        // Generate mock insights based on localStorage data
        const mockInsights: WeeklyInsight[] = [
            {
                type: 'improvement',
                metric: 'Task Completion',
                value: '+15%',
                comparison: 'vs last week',
                icon: <Target size={20} className="text-success" />,
            },
            {
                type: 'improvement',
                metric: 'Aura Earned',
                value: '+1,250',
                comparison: 'this week',
                icon: <Zap size={20} className="text-aura" />,
            },
            {
                type: 'neutral',
                metric: 'Streak',
                value: '7 days',
                comparison: 'maintaining',
                icon: <Flame size={20} className="text-streak" />,
            },
            {
                type: 'decline',
                metric: 'Focus Time',
                value: '-20 min',
                comparison: 'avg daily',
                icon: <Clock size={20} className="text-gray-400" />,
            },
        ];

        setInsights(mockInsights);
    }, []);

    const getTrendIcon = (type: string) => {
        switch (type) {
            case 'improvement':
                return <TrendingUp size={16} className="text-success" />;
            case 'decline':
                return <TrendingDown size={16} className="text-danger" />;
            default:
                return <Minus size={16} className="text-gray-400" />;
        }
    };

    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            <h3 className="font-bold text-white mb-4">Weekly Insights</h3>

            <div className="grid grid-cols-2 gap-3">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border ${insight.type === 'improvement'
                                ? 'border-success/30 bg-success/5'
                                : insight.type === 'decline'
                                    ? 'border-danger/30 bg-danger/5'
                                    : 'border-gray-700 bg-gray-800/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            {insight.icon}
                            {getTrendIcon(insight.type)}
                        </div>
                        <p className="text-xs text-gray-400">{insight.metric}</p>
                        <p className={`text-lg font-bold ${insight.type === 'improvement'
                                ? 'text-success'
                                : insight.type === 'decline'
                                    ? 'text-danger'
                                    : 'text-white'
                            }`}>
                            {insight.value}
                        </p>
                        <p className="text-xs text-gray-500">{insight.comparison}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
