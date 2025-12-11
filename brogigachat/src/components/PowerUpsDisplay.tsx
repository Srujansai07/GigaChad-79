'use client';

import { useState } from 'react';
import { Zap, Shield, Target, Clock, Sparkles } from 'lucide-react';
import { POWER_UPS, type PowerUp } from '@/lib/gamification';

interface PowerUpCardProps {
    powerUp: PowerUp;
    isOwned: boolean;
    isActive: boolean;
    onActivate?: () => void;
}

function PowerUpCard({ powerUp, isOwned, isActive, onActivate }: PowerUpCardProps) {
    return (
        <div className={`p-4 rounded-xl border ${isActive
                ? 'bg-aura/10 border-aura animate-pulse'
                : isOwned
                    ? 'bg-surface border-gray-700'
                    : 'bg-surface/50 border-gray-800 opacity-60'
            }`}>
            <div className="flex items-start gap-3">
                <span className="text-3xl">{powerUp.emoji}</span>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{powerUp.name}</h4>
                        {isActive && (
                            <span className="text-xs px-2 py-0.5 bg-aura text-black rounded-full font-bold">
                                ACTIVE
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{powerUp.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Unlock: {powerUp.unlockCondition}
                    </p>
                    {powerUp.duration && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock size={10} /> {powerUp.duration} min duration
                        </p>
                    )}
                </div>
            </div>
            {isOwned && !isActive && onActivate && (
                <button
                    onClick={onActivate}
                    className="w-full mt-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                    Activate
                </button>
            )}
            {!isOwned && (
                <div className="mt-3 py-2 bg-gray-800 text-gray-500 rounded-lg text-sm text-center">
                    ðŸ”’ Locked
                </div>
            )}
        </div>
    );
}

export default function PowerUpsDisplay() {
    // Mock owned power-ups (would come from user data)
    const [ownedPowerUps] = useState(['immunity_shield']);
    const [activePowerUps] = useState<string[]>([]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-aura" />
                <h3 className="font-medium text-white">Power-Ups</h3>
            </div>

            <p className="text-sm text-gray-400">
                Earn power-ups through achievements. They cannot be bought.
            </p>

            <div className="grid gap-3">
                {POWER_UPS.map((powerUp) => (
                    <PowerUpCard
                        key={powerUp.id}
                        powerUp={powerUp}
                        isOwned={ownedPowerUps.includes(powerUp.id)}
                        isActive={activePowerUps.includes(powerUp.id)}
                        onActivate={() => console.log('Activate', powerUp.id)}
                    />
                ))}
            </div>
        </div>
    );
}
