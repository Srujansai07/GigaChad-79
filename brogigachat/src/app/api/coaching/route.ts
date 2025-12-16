import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
                tasks: {
                    where: { completed: false },
                    take: 5
                },
                auraHistory: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check for user-provided API key
        const geminiKey = request.headers.get('x-gemini-key');

        if (geminiKey) {
            // Use real Gemini AI
            try {
                const genAI = new GoogleGenerativeAI(geminiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

                const prompt = `You are BroGigaChad, a tough-love productivity coach. The user has:
- Level: ${prismaUser.level}
- Aura: ${prismaUser.aura}
- Current Streak: ${prismaUser.streak} days
- Uncompleted Tasks: ${prismaUser.tasks.length}

Give them a SHORT (1-2 sentences) motivational message. Be encouraging but direct. Use emojis.`;

                const result = await model.generateContent(prompt);
                const advice = result.response.text();

                return NextResponse.json({ advice });
            } catch (aiError) {
                console.error('Gemini API error:', aiError);
                return NextResponse.json({ advice: "AI connection failed. Check your API key. 🔑" });
            }
        }

        // Fallback: Mock response
        let advice = "Keep grinding! Consistency is key. 💪";

        if (prismaUser.streak > 5) {
            advice = `You're on fire! 🔥 A ${prismaUser.streak}-day streak is impressive. Don't break the chain now!`;
        } else if (prismaUser.tasks.length > 3) {
            advice = "You've got a lot on your plate. Focus on the smallest task first to build momentum. 🚀";
        } else if (prismaUser.aura < 100) {
            advice = "Your Aura is low. Complete some quick tasks to level up! 💪";
        }

        return NextResponse.json({ advice });

    } catch (error) {
        console.error('Coaching error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
