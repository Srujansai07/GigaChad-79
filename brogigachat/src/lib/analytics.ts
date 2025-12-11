// ==================================================
// BroGigaChad - Analytics System
// Phase 1, Sub 1.8: Productivity Analytics
// ==================================================

// Event types for tracking
export type AnalyticsEvent =
    | { type: 'task_created'; taskId: string; app: string }
    | { type: 'task_completed'; taskId: string; aura: number; duration: number; strictMode: boolean }
    | { type: 'task_skipped'; taskId: string; reason?: string }
    | { type: 'strict_mode_triggered'; taskId: string }
    | { type: 'strict_mode_completed'; taskId: string; forcedCompletion: boolean }
    | { type: 'notification_sent'; taskId: string; type: string }
    | { type: 'notification_action'; taskId: string; action: string }
    | { type: 'level_up'; oldLevel: number; newLevel: number }
    | { type: 'badge_unlocked'; badgeId: string }
    | { type: 'streak_milestone'; days: number }
    | { type: 'app_open'; source: string }
    | { type: 'session_start'; }
    | { type: 'session_end'; duration: number };

interface AnalyticsPayload {
    event: AnalyticsEvent;
    userId?: string;
    timestamp: number;
    sessionId: string;
    metadata?: Record<string, any>;
}

// Session management
let sessionId: string | null = null;
let sessionStart: number | null = null;

export function startSession(): string {
    sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStart = Date.now();
    trackEvent({ type: 'session_start' });
    return sessionId;
}

export function endSession(): void {
    if (sessionStart) {
        trackEvent({ type: 'session_end', duration: Date.now() - sessionStart });
        sessionId = null;
        sessionStart = null;
    }
}

// Local analytics storage
const ANALYTICS_KEY = 'bro-analytics';
const MAX_LOCAL_EVENTS = 1000;

function getLocalEvents(): AnalyticsPayload[] {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveLocalEvents(events: AnalyticsPayload[]): void {
    // Keep only last N events
    const trimmed = events.slice(-MAX_LOCAL_EVENTS);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
}

// Track event
export function trackEvent(event: AnalyticsEvent, metadata?: Record<string, any>): void {
    const payload: AnalyticsPayload = {
        event,
        timestamp: Date.now(),
        sessionId: sessionId || 'unknown',
        metadata,
    };

    // Save locally
    const events = getLocalEvents();
    events.push(payload);
    saveLocalEvents(events);

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', event.type, metadata);
    }

    // TODO: Send to analytics server in batches
}

// ==================================================
// PRODUCTIVITY METRICS
// ==================================================

export interface DailyStats {
    date: string;
    tasksCreated: number;
    tasksCompleted: number;
    tasksSkipped: number;
    auraGained: number;
    auraLost: number;
    strictModeCount: number;
    avgCompletionTime: number; // minutes
    mostProductiveHour: number;
}

export interface WeeklyStats {
    weekStart: string;
    totalTasks: number;
    completionRate: number;
    avgDailyAura: number;
    bestDay: string;
    worstDay: string;
    streakMaintained: boolean;
}

export function calculateDailyStats(events: AnalyticsPayload[], date: string): DailyStats {
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.timestamp).toISOString().split('T')[0];
        return eventDate === date;
    });

    const created = dayEvents.filter(e => e.event.type === 'task_created').length;
    const completed = dayEvents.filter(e => e.event.type === 'task_completed');
    const skipped = dayEvents.filter(e => e.event.type === 'task_skipped').length;
    const strictMode = dayEvents.filter(e => e.event.type === 'strict_mode_triggered').length;

    const auraGained = completed.reduce((sum, e) => {
        if (e.event.type === 'task_completed') {
            return sum + e.event.aura;
        }
        return sum;
    }, 0);

    const auraLost = skipped * 50; // -50 per skip

    const completionTimes = completed
        .filter(e => e.event.type === 'task_completed')
        .map(e => e.event.type === 'task_completed' ? e.event.duration : 0);

    const avgCompletionTime = completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length / 60
        : 0;

    // Find most productive hour
    const hourCounts: Record<number, number> = {};
    completed.forEach(e => {
        const hour = new Date(e.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const mostProductiveHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '9';

    return {
        date,
        tasksCreated: created,
        tasksCompleted: completed.length,
        tasksSkipped: skipped,
        auraGained,
        auraLost,
        strictModeCount: strictMode,
        avgCompletionTime,
        mostProductiveHour: parseInt(mostProductiveHour),
    };
}

// ==================================================
// PRODUCTIVITY HEATMAP
// ==================================================

export interface HeatmapData {
    hour: number;
    day: number; // 0-6 (Sunday-Saturday)
    value: number; // 0-1 intensity
    count: number;
}

export function generateHeatmap(events: AnalyticsPayload[], days: number = 30): HeatmapData[] {
    const heatmap: HeatmapData[] = [];
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    // Initialize grid
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            heatmap.push({ hour, day, value: 0, count: 0 });
        }
    }

    // Count completions
    events
        .filter(e => e.timestamp > cutoff && e.event.type === 'task_completed')
        .forEach(e => {
            const date = new Date(e.timestamp);
            const day = date.getDay();
            const hour = date.getHours();
            const index = day * 24 + hour;
            heatmap[index].count++;
        });

    // Normalize values
    const maxCount = Math.max(...heatmap.map(h => h.count), 1);
    heatmap.forEach(h => {
        h.value = h.count / maxCount;
    });

    return heatmap;
}

// ==================================================
// PATTERN DETECTION
// ==================================================

export interface Pattern {
    type: 'skip_pattern' | 'productive_pattern' | 'strict_mode_pattern';
    description: string;
    suggestion: string;
    confidence: number; // 0-1
}

export function detectPatterns(events: AnalyticsPayload[]): Pattern[] {
    const patterns: Pattern[] = [];
    const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const recentEvents = events.filter(e => e.timestamp > cutoff);

    // Skip pattern: Which day/hour has most skips?
    const skipByHour: Record<number, number> = {};
    const skipByDay: Record<number, number> = {};

    recentEvents
        .filter(e => e.event.type === 'task_skipped')
        .forEach(e => {
            const date = new Date(e.timestamp);
            skipByHour[date.getHours()] = (skipByHour[date.getHours()] || 0) + 1;
            skipByDay[date.getDay()] = (skipByDay[date.getDay()] || 0) + 1;
        });

    const worstHour = Object.entries(skipByHour).sort((a, b) => b[1] - a[1])[0];
    if (worstHour && parseInt(worstHour[1] as any) >= 3) {
        const hourNum = parseInt(worstHour[0]);
        const period = hourNum < 12 ? 'morning' : hourNum < 17 ? 'afternoon' : 'evening';
        patterns.push({
            type: 'skip_pattern',
            description: `You often skip tasks around ${hourNum}:00`,
            suggestion: `Consider scheduling harder tasks for a different time, or enable auto-strict-mode for ${period} tasks.`,
            confidence: 0.7,
        });
    }

    // Productive pattern
    const completeByHour: Record<number, number> = {};
    recentEvents
        .filter(e => e.event.type === 'task_completed')
        .forEach(e => {
            const hour = new Date(e.timestamp).getHours();
            completeByHour[hour] = (completeByHour[hour] || 0) + 1;
        });

    const bestHour = Object.entries(completeByHour).sort((a, b) => b[1] - a[1])[0];
    if (bestHour) {
        patterns.push({
            type: 'productive_pattern',
            description: `You're most productive around ${bestHour[0]}:00`,
            suggestion: `Schedule your most important tasks for this time.`,
            confidence: 0.8,
        });
    }

    return patterns;
}

// ==================================================
// EXPORT / SHARE
// ==================================================

export function exportAnalytics(format: 'json' | 'csv' = 'json'): string {
    const events = getLocalEvents();

    if (format === 'json') {
        return JSON.stringify(events, null, 2);
    }

    // CSV format
    const headers = ['timestamp', 'event_type', 'session_id'];
    const rows = events.map(e => [
        new Date(e.timestamp).toISOString(),
        e.event.type,
        e.sessionId,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
