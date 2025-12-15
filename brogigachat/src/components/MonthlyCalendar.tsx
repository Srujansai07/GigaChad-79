'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Flame } from 'lucide-react';

interface CalendarDay {
    date: Date;
    tasksCompleted: number;
    tasksTotal: number;
    auraEarned: number;
    isCurrentMonth: boolean;
    isToday: boolean;
}

export default function MonthlyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date): CalendarDay[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();

        const days: CalendarDay[] = [];

        // Add days from previous month
        const startPadding = firstDay.getDay();
        for (let i = startPadding - 1; i >= 0; i--) {
            const d = new Date(year, month, -i);
            days.push({
                date: d,
                tasksCompleted: Math.floor(Math.random() * 5),
                tasksTotal: 5,
                auraEarned: Math.floor(Math.random() * 500),
                isCurrentMonth: false,
                isToday: false,
            });
        }

        // Add days of current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const d = new Date(year, month, i);
            days.push({
                date: d,
                tasksCompleted: Math.floor(Math.random() * 6),
                tasksTotal: 5,
                auraEarned: Math.floor(Math.random() * 600),
                isCurrentMonth: true,
                isToday: d.toDateString() === today.toDateString(),
            });
        }

        return days;
    };

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getIntensity = (completed: number, total: number): string => {
        const rate = completed / total;
        if (rate >= 1) return 'bg-success';
        if (rate >= 0.8) return 'bg-success/80';
        if (rate >= 0.6) return 'bg-aura/60';
        if (rate >= 0.4) return 'bg-warning/40';
        if (rate > 0) return 'bg-danger/30';
        return 'bg-gray-800';
    };

    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg">
                    <ChevronLeft size={20} className="text-gray-400" />
                </button>
                <h3 className="font-bold text-white">{monthName}</h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg">
                    <ChevronRight size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs relative ${!day.isCurrentMonth ? 'opacity-30' : ''
                            } ${day.isToday ? 'ring-2 ring-primary' : ''} ${getIntensity(day.tasksCompleted, day.tasksTotal)}`}
                    >
                        <span className={day.tasksCompleted >= day.tasksTotal ? 'text-white font-bold' : 'text-gray-300'}>
                            {day.date.getDate()}
                        </span>
                        {day.tasksCompleted >= day.tasksTotal && day.isCurrentMonth && (
                            <div className="absolute -top-1 -right-1">
                                <Flame size={10} className="text-streak" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-800" />
                    <span>0%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-warning/40" />
                    <span>50%</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}
