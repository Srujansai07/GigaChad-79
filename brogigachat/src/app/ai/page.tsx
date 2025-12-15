'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, MessageSquare, Zap, Target, Trophy, Users } from 'lucide-react';
import AIChat from '@/components/AIChat';

export default function AIPage() {
    const [activeTab, setActiveTab] = useState<'chat' | 'actions'>('chat');

    const quickActions = [
        { icon: <Target size={20} />, label: 'Set Goals', desc: 'AI helps define your objectives' },
        { icon: <Zap size={20} />, label: 'Quick Motivation', desc: 'Get an instant pep talk' },
        { icon: <Trophy size={20} />, label: 'Review Progress', desc: 'Analyze your achievements' },
        { icon: <Users size={20} />, label: 'Squad Challenge', desc: 'Create a group challenge' },
    ];

    return (
        <main className="min-h-screen bg-background p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">BroGigaChad AI</h1>
                        <p className="text-sm text-gray-400">Your TopG productivity coach</p>
                    </div>
                    <div className="text-4xl">🤖</div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'chat'
                                ? 'bg-primary text-white'
                                : 'bg-surface border border-gray-700 text-gray-400'
                            }`}
                    >
                        <MessageSquare size={18} />
                        Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('actions')}
                        className={`flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'actions'
                                ? 'bg-primary text-white'
                                : 'bg-surface border border-gray-700 text-gray-400'
                            }`}
                    >
                        <Zap size={18} />
                        Quick Actions
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'chat' ? (
                    <AIChat />
                ) : (
                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className="w-full p-4 bg-surface border border-gray-700 rounded-xl flex items-center gap-4 hover:border-primary transition-colors"
                            >
                                <div className="p-3 bg-primary/20 rounded-lg text-primary">
                                    {action.icon}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-white">{action.label}</p>
                                    <p className="text-sm text-gray-400">{action.desc}</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-500" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
