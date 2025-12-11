// ==================================================
// BroGigaChad - Grok AI Integration
// Phase 1, Sub 1.5: AI Task Enhancement
// ==================================================

// Grok API client for x.ai
export class GrokClient {
    private apiKey: string;
    private baseUrl = 'https://api.x.ai/v1';
    private model = 'grok-beta';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.GROK_API_KEY || '';
    }

    async chat(messages: GrokMessage[], options?: GrokOptions): Promise<GrokResponse> {
        if (!this.apiKey) {
            throw new Error('Grok API key not configured');
        }

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens ?? 500,
                stream: false,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Grok API error: ${response.status} - ${error}`);
        }

        return response.json();
    }
}

// Types
export interface GrokMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface GrokOptions {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}

export interface GrokResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: GrokMessage;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// ==================================================
// BRO PERSONALITY SYSTEM
// ==================================================

const BRO_SYSTEM_PROMPTS: Record<string, string> = {
    topg: `You are BroGigaChad, a digital accountability partner with TopG energy. You speak like Andrew Tate mixed with a supportive older brother.

Key traits:
- Direct, no-nonsense advice
- Challenges excuses immediately
- Motivates through tough love
- Uses "bro", "king", "legend"
- Short, punchy sentences
- Never accepts weakness
- Celebrates wins aggressively

Never be mean or cruel. Always be constructive. The goal is to push the user to action.`,

    monk: `You are BroGigaChad in Monk Mode. You speak with stoic wisdom and calm clarity.

Key traits:
- Patient and understanding
- Philosophical but practical
- Quotes stoic wisdom
- Focus on discipline over motivation
- Speaks calmly but firmly
- Encourages deep work
- Values progress over perfection

Help the user find inner strength through discipline.`,

    friend: `You are BroGigaChad as a Best Friend. Supportive but real.

Key traits:
- Warm and encouraging
- Honest but kind
- Celebrates small wins
- Acknowledges struggles
- Offers practical help
- Uses humor appropriately
- Always has user's back

Be genuinely supportive while still holding accountability.`,

    drill: `You are BroGigaChad as a Drill Sergeant. INTENSE motivation.

Key traits:
- ALL CAPS when needed
- Military-style discipline
- NO EXCUSES ACCEPTED
- Counts reps and sets
- Uses military metaphors
- Extremely direct
- Never tolerates laziness

Push the user HARD but never break them.`,
};

export type VoicePack = keyof typeof BRO_SYSTEM_PROMPTS;

// ==================================================
// AI TASK ENHANCEMENT
// ==================================================

export interface TaskEnhancement {
    type: 'tweet' | 'content' | 'study' | 'workout' | 'general';
    original: string;
    suggestions: string[];
    hashtags?: string[];
    optimalTime?: string;
    tips?: string[];
}

export async function enhanceTask(
    grok: GrokClient,
    taskTitle: string,
    taskType: TaskEnhancement['type'],
    userContext?: string,
    voicePack: VoicePack = 'topg'
): Promise<TaskEnhancement> {
    const prompts: Record<TaskEnhancement['type'], string> = {
        tweet: `Generate 3 tweet options for this goal: "${taskTitle}". 
Include relevant hashtags. Keep each under 280 chars. Make them engaging and authentic.
Format: Tweet 1: ... Tweet 2: ... Tweet 3: ... Hashtags: ...`,

        content: `Help me plan this content task: "${taskTitle}".
Give me: 1) A clear first step, 2) Estimated time, 3) Key tips for quality.
Be specific and actionable.`,

        study: `Create a study plan for: "${taskTitle}".
Give me: 1) Study technique to use, 2) Time blocks, 3) Key focus areas.
Make it practical and efficient.`,

        workout: `Motivate me for this workout: "${taskTitle}".
Give me: 1) A pump-up message, 2) First exercise, 3) Key form tips.
Get me FIRED UP to start.`,

        general: `Help me crush this task: "${taskTitle}".
Give me: 1) Immediate first action, 2) Potential obstacles, 3) How to stay focused.
Make it actionable NOW.`,
    };

    const systemPrompt = BRO_SYSTEM_PROMPTS[voicePack];
    const userPrompt = prompts[taskType] + (userContext ? `\n\nAdditional context: ${userContext}` : '');

    try {
        const response = await grok.chat([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ]);

        const content = response.choices[0]?.message?.content || '';

        // Parse response into structured format
        return parseEnhancementResponse(content, taskType, taskTitle);
    } catch (error) {
        console.error('AI enhancement failed:', error);
        return {
            type: taskType,
            original: taskTitle,
            suggestions: [`Just start: ${taskTitle}`],
        };
    }
}

function parseEnhancementResponse(
    content: string,
    type: TaskEnhancement['type'],
    original: string
): TaskEnhancement {
    // Basic parsing - split by numbered items
    const lines = content.split('\n').filter(l => l.trim());
    const suggestions: string[] = [];
    const hashtags: string[] = [];
    const tips: string[] = [];

    for (const line of lines) {
        if (line.match(/^(Tweet|Option|\d)[:\.\)]/i)) {
            suggestions.push(line.replace(/^[^:]+:\s*/, '').trim());
        }
        if (line.toLowerCase().includes('hashtag')) {
            const tags = line.match(/#\w+/g);
            if (tags) hashtags.push(...tags);
        }
        if (line.toLowerCase().includes('tip') || line.match(/^\d\./)) {
            tips.push(line.replace(/^\d\.?\s*/, '').trim());
        }
    }

    return {
        type,
        original,
        suggestions: suggestions.length > 0 ? suggestions : [content.slice(0, 200)],
        hashtags: hashtags.length > 0 ? hashtags : undefined,
        tips: tips.length > 0 ? tips.slice(0, 3) : undefined,
    };
}

// ==================================================
// MOTIVATIONAL MESSAGES
// ==================================================

export async function getMotivationalMessage(
    grok: GrokClient,
    context: {
        currentStreak: number;
        tasksCompletedToday: number;
        lastSkipReason?: string;
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    },
    voicePack: VoicePack = 'topg'
): Promise<string> {
    const systemPrompt = BRO_SYSTEM_PROMPTS[voicePack];

    const userPrompt = `Generate a short (1-2 sentences) motivational message.
Context:
- Current streak: ${context.currentStreak} days
- Tasks completed today: ${context.tasksCompletedToday}
- Time: ${context.timeOfDay}
${context.lastSkipReason ? `- They just skipped a task because: "${context.lastSkipReason}"` : ''}

Make it personal and specific to their situation. Push them to action.`;

    try {
        const response = await grok.chat([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ]);

        return response.choices[0]?.message?.content || getDefaultMotivation(context.timeOfDay);
    } catch {
        return getDefaultMotivation(context.timeOfDay);
    }
}

function getDefaultMotivation(timeOfDay: string): string {
    const defaults: Record<string, string[]> = {
        morning: ["Morning is money time. Let's get it.", "Early grind, early win. Move."],
        afternoon: ["Afternoon slump is for the weak. Push through.", "Half day gone, but the war isn't over."],
        evening: ["Evening grind hits different. Finish strong.", "While they rest, we build."],
        night: ["Night owl mode activated. Let's work.", "Dark hours, bright focus. Execute."],
    };
    const options = defaults[timeOfDay] || defaults.morning;
    return options[Math.floor(Math.random() * options.length)];
}

// ==================================================
// PATTERN RECOGNITION (Future ML)
// ==================================================

export interface UserPattern {
    skipTimes: Date[];
    completionTimes: Date[];
    mostProductiveHour: number;
    skipDayOfWeek: number[]; // 0-6
    averageTaskDuration: number;
    strictModeTriggers: string[];
}

export function analyzePatterns(_history: any[]): UserPattern {
    // Placeholder for ML pattern recognition
    // Would analyze user behavior and predict procrastination
    return {
        skipTimes: [],
        completionTimes: [],
        mostProductiveHour: 9,
        skipDayOfWeek: [1], // Mondays
        averageTaskDuration: 25,
        strictModeTriggers: ['social_media', 'after_lunch'],
    };
}
