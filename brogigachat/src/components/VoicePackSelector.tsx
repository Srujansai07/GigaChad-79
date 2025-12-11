'use client';

import { useState } from 'react';
import { Volume2, Check } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

type VoicePack = 'topg' | 'monk' | 'friend' | 'drill';

interface VoiceOption {
    id: VoicePack;
    name: string;
    description: string;
    emoji: string;
    sample: string;
    premium: boolean;
}

const VOICE_OPTIONS: VoiceOption[] = [
    {
        id: 'topg',
        name: 'TopG Mode',
        description: 'Andrew Tate energy. Direct. No excuses accepted.',
        emoji: 'ðŸ”¥',
        sample: "Stop scrolling. Get to work. NOW.",
        premium: false,
    },
    {
        id: 'monk',
        name: 'Monk Mode',
        description: 'Stoic wisdom. Calm but firm discipline.',
        emoji: 'ðŸ§˜',
        sample: "Discipline is choosing what you want most over what you want now.",
        premium: false,
    },
    {
        id: 'friend',
        name: 'Best Friend',
        description: 'Supportive but real. Has your back.',
        emoji: 'ðŸ’ª',
        sample: "Hey, I know you're tired. But remember why you started. Let's go.",
        premium: false,
    },
    {
        id: 'drill',
        name: 'Drill Sergeant',
        description: 'INTENSE. Military-style discipline. No mercy.',
        emoji: 'ðŸŽ–ï¸',
        sample: "DROP AND GIVE ME PRODUCTIVITY! NO EXCUSES, SOLDIER!",
        premium: true,
    },
];

export default function VoicePackSelector() {
    const { user, updateUser } = useUserStore();
    const [selectedVoice, setSelectedVoice] = useState<VoicePack>(user.voicePack || 'topg');
    const [playingSample, setPlayingSample] = useState<string | null>(null);

    const handleSelect = (voice: VoicePack) => {
        setSelectedVoice(voice);
        updateUser({ voicePack: voice });
    };

    const playSample = (voiceId: string) => {
        setPlayingSample(voiceId);
        // In real app, would play audio
        setTimeout(() => setPlayingSample(null), 2000);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <Volume2 size={20} className="text-primary" />
                <h3 className="font-medium text-white">Voice Pack</h3>
            </div>

            {VOICE_OPTIONS.map((voice) => (
                <button
                    key={voice.id}
                    onClick={() => handleSelect(voice.id)}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${selectedVoice === voice.id
                            ? 'bg-primary/10 border-primary'
                            : 'bg-surface border-gray-700 hover:border-gray-600'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{voice.emoji}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{voice.name}</span>
                                {voice.premium && (
                                    <span className="text-xs px-2 py-0.5 bg-aura/20 text-aura rounded-full">PRO</span>
                                )}
                                {selectedVoice === voice.id && (
                                    <Check size={16} className="text-primary ml-auto" />
                                )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{voice.description}</p>
                            <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                                <p className="text-xs text-gray-300 italic">"{voice.sample}"</p>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
