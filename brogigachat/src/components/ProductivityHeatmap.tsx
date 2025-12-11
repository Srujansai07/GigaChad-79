'use client';

import { useMemo } from 'react';
import { generateHeatmap, type HeatmapData } from '@/lib/analytics';

interface ProductivityHeatmapProps {
    events?: any[];
    days?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function ProductivityHeatmap({ events = [], days = 30 }: ProductivityHeatmapProps) {
    const heatmap = useMemo(() => generateHeatmap(events, days), [events, days]);

    const getCell = (day: number, hour: number): HeatmapData | undefined => {
        return heatmap.find(h => h.day === day && h.hour === hour);
    };

    const getColor = (value: number): string => {
        if (value === 0) return 'bg-surface';
        if (value < 0.25) return 'bg-success/20';
        if (value < 0.5) return 'bg-success/40';
        if (value < 0.75) return 'bg-success/60';
        return 'bg-success';
    };

    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Productivity Heatmap</h3>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Hour labels */}
                    <div className="flex mb-1">
                        <div className="w-10" /> {/* Spacer for day labels */}
                        {HOURS.filter(h => h % 3 === 0).map(hour => (
                            <div
                                key={hour}
                                className="flex-1 text-[10px] text-gray-500 text-center"
                                style={{ minWidth: '12px' }}
                            >
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    {DAYS.map((dayName, dayIndex) => (
                        <div key={dayName} className="flex gap-0.5 mb-0.5">
                            <div className="w-10 text-[10px] text-gray-500 flex items-center">
                                {dayName}
                            </div>
                            {HOURS.map(hour => {
                                const cell = getCell(dayIndex, hour);
                                return (
                                    <div
                                        key={hour}
                                        className={`w-3 h-3 rounded-sm ${getColor(cell?.value || 0)} transition-colors hover:ring-1 hover:ring-white/20`}
                                        title={`${dayName} ${hour}:00 - ${cell?.count || 0} tasks`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-gray-500">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-surface" />
                <div className="w-3 h-3 rounded-sm bg-success/20" />
                <div className="w-3 h-3 rounded-sm bg-success/40" />
                <div className="w-3 h-3 rounded-sm bg-success/60" />
                <div className="w-3 h-3 rounded-sm bg-success" />
                <span>More</span>
            </div>
        </div>
    );
}
