import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create badges
    const badges = [
        // Early achievements
        { id: 'first_blood', name: 'First Blood', description: 'Complete your first task', emoji: '🩸', auraReward: 50, criteriaType: 'tasksCompleted', criteriaValue: 1 },
        { id: 'getting_started', name: 'Getting Started', description: 'Complete 10 tasks', emoji: '🚀', auraReward: 100, criteriaType: 'tasksCompleted', criteriaValue: 10 },
        { id: 'hustler100', name: 'Century Hustler', description: 'Complete 100 tasks', emoji: '💯', auraReward: 500, criteriaType: 'tasksCompleted', criteriaValue: 100 },

        // Streak badges
        { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', emoji: '⚔️', auraReward: 200, criteriaType: 'streak', criteriaValue: 7 },
        { id: 'month_machine', name: 'Month Machine', description: '30-day streak', emoji: '🤖', auraReward: 1000, criteriaType: 'streak', criteriaValue: 30 },
        { id: 'quarter_crusher', name: 'Quarter Crusher', description: '90-day streak', emoji: '💎', auraReward: 5000, criteriaType: 'streak', criteriaValue: 90 },
        { id: 'year_legend', name: 'Year Legend', description: '365-day streak', emoji: '👑', auraReward: 50000, criteriaType: 'streak', criteriaValue: 365 },

        // Strict mode badges
        { id: 'strict_survivor', name: 'Strict Survivor', description: 'Complete 1 strict mode session', emoji: '💪', auraReward: 100, criteriaType: 'strictModeCount', criteriaValue: 1 },
        { id: 'discipline_master', name: 'Discipline Master', description: 'Complete 10 strict mode sessions', emoji: '🏋️', auraReward: 500, criteriaType: 'strictModeCount', criteriaValue: 10 },
        { id: 'unbreakable', name: 'Unbreakable', description: 'Complete 50 strict mode sessions', emoji: '🪨', auraReward: 2500, criteriaType: 'strictModeCount', criteriaValue: 50 },

        // Level badges
        { id: 'level_grinder', name: 'Grinder Status', description: 'Reach Grinder level', emoji: '⚡', auraReward: 100, criteriaType: 'level', criteriaValue: 2 },
        { id: 'level_alpha', name: 'Alpha Status', description: 'Reach Alpha level', emoji: '🔥', auraReward: 500, criteriaType: 'level', criteriaValue: 4 },
        { id: 'level_sigma', name: 'Sigma Status', description: 'Reach Sigma level', emoji: '💀', auraReward: 2000, criteriaType: 'level', criteriaValue: 5 },
        { id: 'level_topg', name: 'TopG Status', description: 'Reach TopG level', emoji: '👑', auraReward: 10000, criteriaType: 'level', criteriaValue: 6 },
        { id: 'level_legend', name: 'Legend Status', description: 'Reach Legend level', emoji: '🏆', auraReward: 50000, criteriaType: 'level', criteriaValue: 7 },

        // Special badges
        { id: 'founder', name: 'OG Founder', description: 'Early adopter badge', emoji: '🔥', auraReward: 1000, criteriaType: 'special', criteriaValue: 1 },
        { id: 'perfectionist', name: 'Perfectionist', description: 'Complete 7 days with 0 skips', emoji: '✨', auraReward: 750, criteriaType: 'special', criteriaValue: 2 },
        { id: 'night_owl', name: 'Night Owl', description: 'Complete 10 tasks after midnight', emoji: '🦉', auraReward: 300, criteriaType: 'special', criteriaValue: 3 },
    ];

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { id: badge.id },
            update: badge,
            create: badge,
        });
        console.log(`  ✅ Badge: ${badge.name}`);
    }

    console.log(`\n✨ Seeded ${badges.length} badges`);

    // Create Global Challenges
    const challenges = [
        {
            id: 'global_pushups',
            name: '100 Pushup Challenge',
            description: 'Complete 100 pushups in a single day',
            type: 'SOLO',
            goal: 100,
            reward: 500,
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            active: true
        },
        {
            id: 'global_meditation',
            name: 'Zen Master Week',
            description: 'Meditate for 20 mins daily for a week',
            type: 'SOLO',
            goal: 7,
            reward: 1000,
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            active: true
        },
        {
            id: 'squad_steps',
            name: 'Million Step March',
            description: 'Squad goal: Hit 1M steps collectively',
            type: 'SQUAD',
            goal: 1000000,
            reward: 5000,
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            active: true
        }
    ];

    for (const challenge of challenges) {
        // @ts-ignore - Enum type mismatch in seed script is common, ignoring for seed
        await prisma.challenge.upsert({
            where: { id: challenge.id },
            update: challenge,
            create: challenge,
        });
        console.log(`  ✅ Challenge: ${challenge.name}`);
    }
    console.log(`✨ Seeded ${challenges.length} challenges`);


    console.log(`\n✨ Seeded ${badges.length} badges`);
    console.log('🎉 Database seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
