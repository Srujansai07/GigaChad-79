'use client';
import { Zap, Flame, Target, Shield, Award, RotateCcw } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import { getLevelInfo } from '@/types';

interface ProfileProps {
    user?: any; // Replace with proper type
}

export default function Profile({ user: serverUser }: ProfileProps) {
    const { user: clientUser, resetProgress } = useUserStore();
    const { tasks } = useTaskStore();

    // Use server user if available, otherwise client user
    const user = serverUser || clientUser;
    const levelInfo = getLevelInfo(user.aura);

    const completedTasks = user.tasksCompleted || tasks.filter((t) => t.completed).length;
    const totalTasks = user.tasksTotal || tasks.length;
    const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const handleReset = () => {
        if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
            resetProgress();
            window.location.reload();
        }
    };

    // Badges (simplified for now)
    const badges = [
        { id: 'founder', name: 'Founder', emoji: '🔥', unlocked: true },
        { id: 'streak7', name: '7-Day Streak', emoji: '⚡', unlocked: user.streak >= 7 },
        { id: 'strict', name: 'Strict Survivor', emoji: '💪', unlocked: user.strictModeCount >= 1 },
        { id: 'hustler', name: 'Hustler', emoji: '🚀', unlocked: user.tasksCompleted >= 10 },
    ];

    return (
        <div className="p-4 space-y-6">
            {/* Profile Header */}
            <div className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/30`}>
                    {user.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <h1 className="text-2xl font-bold text-white mt-4">{user.username || 'User'}</h1>
                <p className={`text-lg ${levelInfo.color}`}>{levelInfo.name} (Level {levelInfo.level})</p>
                <div className="flex items-center justify-center gap-1 text-aura mt-2">
                    <Zap size={20} />
                    <span className="text-xl font-bold">{user.aura?.toLocaleString() || 0} Aura</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface p-4 rounded-lg text-center">
                    <Target className="w-6 h-6 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold text-white">{completedTasks}</p>
                    <p className="text-xs text-gray-400">Tasks Completed</p>
                </div>
                <div className="bg-surface p-4 rounded-lg text-center">
                    <Flame className="w-6 h-6 mx-auto text-streak mb-2" />
                    <p className="text-2xl font-bold text-white">{user.streak || 0}</p>
                    <p className="text-xs text-gray-400">Day Streak</p>
                </div>
                <div className="bg-surface p-4 rounded-lg text-center">
                    <Shield className="w-6 h-6 mx-auto text-danger mb-2" />
                    <p className="text-2xl font-bold text-white">{user.strictModeCount || 0}</p>
                    <p className="text-xs text-gray-400">Strict Modes</p>
                </div>
                <div className="bg-surface p-4 rounded-lg text-center">
                    <Award className="w-6 h-6 mx-auto text-success mb-2" />
                    <p className="text-2xl font-bold text-white">{successRate}%</p>
                    <p className="text-xs text-gray-400">Success Rate</p>
                </div>
            </div>

            {/* Badges */}
            <div>
                <h2 className="font-bold text-lg mb-3">Badges</h2>
                <div className="grid grid-cols-4 gap-2">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`p-3 rounded-lg text-center ${badge.unlocked
                                ? 'bg-surface border border-aura/30'
                                : 'bg-surface/50 opacity-40'
                                }`}
                        >
                            <span className="text-2xl">{badge.emoji}</span>
                            <p className="text-xs text-gray-400 mt-1">{badge.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4">
                <button
                    onClick={handleReset}
                    className="w-full py-3 bg-surface border border-danger/30 rounded-lg text-danger flex items-center justify-center gap-2 hover:bg-danger/10 transition-colors"
                >
                    <RotateCcw size={18} />
                    Reset Progress
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                    This will delete all your data permanently.
                </p>
            </div>
        </div>
    );
}

