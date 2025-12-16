'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';

export default function AICoach() {
    const [isOpen, setIsOpen] = useState(false);
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getAdvice = async () => {
        setIsLoading(true);
        setIsOpen(true);
        try {
            const apiKey = localStorage.getItem('gemini_api_key') || '';
            const res = await fetch('/api/coaching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-gemini-key': apiKey
                }
            });
            const data = await res.json();
            setAdvice(data.advice);
        } catch (error) {
            setAdvice("Failed to connect to the neural link. Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={getAdvice}
                className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-30 animate-pulse-subtle"
            >
                <Sparkles size={24} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface border border-purple-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        {isLoading ? <Loader2 className="animate-spin" size={32} /> : <Sparkles size={32} />}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">AI Coach</h3>
                        <p className="text-gray-300 min-h-[80px] flex items-center justify-center">
                            {isLoading ? "Analyzing your stats..." : `"${advice}"`}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
}
