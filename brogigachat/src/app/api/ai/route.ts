import { NextResponse } from 'next/server';
import { GrokClient, enhanceTask, getMotivationalMessage } from '@/lib/ai';

const grok = new GrokClient();

// AI Enhancement endpoint
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'enhance': {
                const { taskTitle, taskType, userContext, voicePack } = body;
                const enhancement = await enhanceTask(grok, taskTitle, taskType, userContext, voicePack);
                return NextResponse.json(enhancement);
            }

            case 'motivate': {
                const { streak, tasksToday, skipReason, timeOfDay, voicePack } = body;
                const message = await getMotivationalMessage(grok, {
                    currentStreak: streak || 0,
                    tasksCompletedToday: tasksToday || 0,
                    lastSkipReason: skipReason,
                    timeOfDay: timeOfDay || 'morning',
                }, voicePack);
                return NextResponse.json({ message });
            }

            case 'chat': {
                const { messages, voicePack } = body;
                const response = await grok.chat(messages);
                return NextResponse.json(response);
            }

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('AI API error:', error);
        return NextResponse.json({ error: error.message || 'AI request failed' }, { status: 500 });
    }
}
