import { prisma } from '@/lib/prisma';
import { BADGE_RULES } from './badgeRules';

export async function checkAndUnlockBadges(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { badges: true },
    });

    if (!user) return [];

    const newBadges = [];

    for (const rule of BADGE_RULES) {
        // Check if user already has the badge
        const hasBadge = user.badges.some((ub) => ub.badgeId === rule.id);
        if (hasBadge) continue;

        // Check if user meets criteria
        if (rule.check(user)) {
            // Unlock badge
            // 1. Create Badge record if it doesn't exist (idempotent)
            await prisma.badge.upsert({
                where: { name: rule.name },
                update: {},
                create: {
                    id: rule.id,
                    name: rule.name,
                    description: rule.description,
                    emoji: rule.emoji,
                    auraReward: rule.auraReward,
                    criteria: {}, // Static rules for now
                },
            });

            // 2. Link to user
            await prisma.userBadge.create({
                data: {
                    userId: user.id,
                    badgeId: rule.id,
                },
            });

            // 3. Award Aura
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    aura: { increment: rule.auraReward },
                    auraHistory: {
                        create: {
                            amount: rule.auraReward,
                            reason: 'BADGE_REWARD',
                        },
                    },
                },
            });

            newBadges.push(rule);
        }
    }

    return newBadges;
}
