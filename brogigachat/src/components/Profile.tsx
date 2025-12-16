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

                                : 'bg-surface/50 opacity-40'
} `}
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

