// ==================================================
// BroGigaChad - Zod Validation Schemas
// Phase 1, Sub 1.6: Input Validation
// ==================================================

import { z } from 'zod';

// ==================================================
// USER SCHEMAS
// ==================================================

export const UsernameSchema = z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const EmailSchema = z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long');

export const PasswordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const CreateUserSchema = z.object({
    email: EmailSchema,
    username: UsernameSchema,
    password: PasswordSchema,
});

export const UpdateUserSchema = z.object({
    username: UsernameSchema.optional(),
    notificationsEnabled: z.boolean().optional(),
    strictModeEnabled: z.boolean().optional(),
    voicePack: z.enum(['topg', 'monk', 'friend', 'drill']).optional(),
});

export const LoginSchema = z.object({
    email: EmailSchema,
    password: z.string().min(1, 'Password is required'),
});

// ==================================================
// TASK SCHEMAS
// ==================================================

export const TaskTitleSchema = z
    .string()
    .min(1, 'Task title is required')
    .max(100, 'Task title too long');

export const TaskDescriptionSchema = z
    .string()
    .max(500, 'Description too long')
    .optional();

export const AppNameSchema = z.enum([
    'twitter', 'instagram', 'youtube', 'spotify', 'notion',
    'strava', 'gmail', 'calendar', 'notes', 'fitness', 'browser', 'custom'
]);

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const CreateTaskSchema = z.object({
    title: TaskTitleSchema,
    description: TaskDescriptionSchema,
    app: AppNameSchema,
    scheduledFor: z.coerce.date(),
    baseAura: z.number().min(10).max(1000).default(100),
    difficulty: DifficultySchema.optional(),
    context: z.object({
        message: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        url: z.string().url().optional(),
        playlistId: z.string().optional(),
        pageId: z.string().optional(),
    }).optional(),
    repeat: z.enum(['none', 'daily', 'weekly', 'monthly']).optional(),
});

export const UpdateTaskSchema = z.object({
    title: TaskTitleSchema.optional(),
    description: TaskDescriptionSchema,
    scheduledFor: z.coerce.date().optional(),
    status: z.enum(['PENDING', 'NOTIFIED', 'SKIPPED', 'STRICT_MODE', 'COMPLETED', 'CANCELLED']).optional(),
});

export const CompleteTaskSchema = z.object({
    taskId: z.string().cuid(),
    auraGained: z.number().int(),
    completedInStrictMode: z.boolean().default(false),
    completedOnFirstNotification: z.boolean().default(false),
    completionTime: z.number().optional(), // seconds taken
});

export const SkipTaskSchema = z.object({
    taskId: z.string().cuid(),
    reason: z.string().max(200).optional(),
    extendMinutes: z.union([z.literal(10), z.literal(30)]),
});

// ==================================================
// NOTIFICATION SCHEMAS
// ==================================================

export const PushSubscriptionSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string(),
        auth: z.string(),
    }),
    expirationTime: z.number().nullable().optional(),
});

export const SendNotificationSchema = z.object({
    userId: z.string().cuid(),
    type: z.enum(['FIRST_REMINDER', 'SECOND_REMINDER', 'FINAL_WARNING', 'STRICT_MODE_ACTIVATION']),
    taskId: z.string().cuid().optional(),
    title: z.string().max(100),
    body: z.string().max(300),
});

export const NotificationActionSchema = z.object({
    taskId: z.string().cuid(),
    action: z.enum(['DO_IT', 'EXTEND_10', 'EXTEND_30', 'IGNORED']),
});

// ==================================================
// AI SCHEMAS
// ==================================================

export const TaskEnhancementRequestSchema = z.object({
    taskTitle: TaskTitleSchema,
    taskType: z.enum(['tweet', 'content', 'study', 'workout', 'general']),
    userContext: z.string().max(500).optional(),
    voicePack: z.enum(['topg', 'monk', 'friend', 'drill']).default('topg'),
});

export const MotivationRequestSchema = z.object({
    streak: z.number().int().min(0),
    tasksToday: z.number().int().min(0),
    skipReason: z.string().max(200).optional(),
    timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']),
    voicePack: z.enum(['topg', 'monk', 'friend', 'drill']).default('topg'),
});

// ==================================================
// LEADERBOARD & SOCIAL SCHEMAS
// ==================================================

export const LeaderboardQuerySchema = z.object({
    type: z.enum(['global', 'city', 'university', 'friends', 'squad']).default('global'),
    limit: z.number().int().min(1).max(100).default(10),
    offset: z.number().int().min(0).default(0),
    city: z.string().optional(),
    universityId: z.string().optional(),
    squadId: z.string().optional(),
});

export const ChallengeSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().max(200),
    type: z.enum(['solo', 'pvp', 'squad']),
    duration: z.number().int().min(1).max(30), // days
    goal: z.object({
        metric: z.enum(['tasks', 'aura', 'streak', 'strict']),
        value: z.number().int().min(1),
    }),
    reward: z.object({
        aura: z.number().int().min(0),
        badge: z.string().optional(),
        powerUp: z.string().optional(),
    }),
});

// ==================================================
// HELPER TYPES (Exported)
// ==================================================

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type CompleteTask = z.infer<typeof CompleteTaskSchema>;
export type SkipTask = z.infer<typeof SkipTaskSchema>;
export type PushSubscription = z.infer<typeof PushSubscriptionSchema>;
export type SendNotification = z.infer<typeof SendNotificationSchema>;
export type TaskEnhancementRequest = z.infer<typeof TaskEnhancementRequestSchema>;
export type MotivationRequest = z.infer<typeof MotivationRequestSchema>;
export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;

// ==================================================
// VALIDATION HELPER
// ==================================================

export function validateInput<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    return {
        success: false,
        errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
}
