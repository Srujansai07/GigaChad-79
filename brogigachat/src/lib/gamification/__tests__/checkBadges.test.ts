import { checkBadges } from '../checkBadges';
import { BADGE_RULES } from '../badgeRules';

// Mock Prisma
const mockPrisma = {
    badge: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    user: {
        update: jest.fn(),
    },
};

jest.mock('@/lib/prisma', () => ({
    prisma: mockPrisma,
}));

describe('checkBadges', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should award FIRST_BLOOD badge if user has 1 completed task', async () => {
        const userId = 'user-123';
        const userStats = { tasksCompleted: 1, streak: 0 };

        // Mock badge not existing
        mockPrisma.badge.findUnique.mockResolvedValue(null);

        const newBadges = await checkBadges(userId, userStats);

        expect(newBadges).toContain('FIRST_BLOOD');
        expect(mockPrisma.badge.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                id: 'FIRST_BLOOD',
                userId,
            }),
        }));
    });

    it('should award STREAK_MASTER badge if user has 7 day streak', async () => {
        const userId = 'user-123';
        const userStats = { tasksCompleted: 10, streak: 7 };

        mockPrisma.badge.findUnique.mockResolvedValue(null);

        const newBadges = await checkBadges(userId, userStats);

        expect(newBadges).toContain('STREAK_MASTER');
    });

    it('should not award badge if already owned', async () => {
        const userId = 'user-123';
        const userStats = { tasksCompleted: 1, streak: 0 };

        // Mock badge existing
        mockPrisma.badge.findUnique.mockResolvedValue({ id: 'FIRST_BLOOD' });

        const newBadges = await checkBadges(userId, userStats);

        expect(newBadges).toHaveLength(0);
        expect(mockPrisma.badge.create).not.toHaveBeenCalled();
    });
});
