'use client';

import { useState, useEffect } from 'react';
import { Key, Save, Check, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Settings() {
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('gemini_api_key');
        if (saved) {
            setApiKey(saved);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-4">
                <h1 className="text-xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 text-xs">Configure your experience</p>
            </div>

            <div className="p-4 space-y-6">
                {/* AI Configuration */}
                <div className="bg-surface border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Key size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">AI Coach</h3>
                            <p className="text-xs text-gray-400">Enter your Gemini API Key for real AI</p>
                        </div>
                    </div>

                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter Gemini API Key..."
                        className="w-full bg-surface-alt text-white p-3 rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {isSaved ? <Check size={16} /> : <Save size={16} />}
                            {isSaved ? 'Saved!' : 'Save Key'}
                        </button>
                        <button
                            onClick={handleClear}
                            className="bg-danger/20 text-danger hover:bg-danger/30 px-4 py-2 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                        Get your key at{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">
                            aistudio.google.com
                        </a>
                    </p>
                </div>
            </div>

            <BottomNav currentScreen="profile" />
        </div>
    );
}
