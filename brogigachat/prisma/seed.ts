import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create Global Challenges
    const challenges = [
        {
            id: 'global_pushups',
            name: '100 Pushup Challenge',
            description: 'Complete 100 pushups in a single day',
            type: 'SOLO' as const,
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
            type: 'SOLO' as const,
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
            type: 'SQUAD' as const,
            goal: 1000000,
            reward: 5000,
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            active: true
        }
    ];

    for (const challenge of challenges) {
        await prisma.challenge.upsert({
            where: { id: challenge.id },
            update: challenge,
            create: challenge,
        });
        console.log(`  ✅ Challenge: ${challenge.name}`);
    }

    console.log(`✨ Seeded ${challenges.length} challenges`);
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
