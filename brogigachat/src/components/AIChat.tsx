'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Yo bro! I'm your TopG productivity assistant. What needs to get done today? ðŸ”¥",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input.trim(),
                    voicePack: 'topg',
                }),
            });

            if (!response.ok) throw new Error('AI request failed');

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || "Keep grinding bro! ðŸ’ª",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Bro, I'm having connection issues. But don't let that stop your grind! ðŸ”¥",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-surface rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-white">BroGigaChad AI</h3>
                    <p className="text-xs text-gray-400">Your TopG productivity partner</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-primary' : 'bg-gray-800'
                            }`}>
                            {message.role === 'user' ? (
                                <User size={16} className="text-white" />
                            ) : (
                                <Bot size={16} className="text-primary" />
                            )}
                        </div>
                        <div className={`max-w-[70%] p-3 rounded-xl ${message.role === 'user'
                                ? 'bg-primary text-white rounded-br-sm'
                                : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                            }`}>
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="p-2 rounded-lg bg-gray-800">
                            <Bot size={16} className="text-primary" />
                        </div>
                        <div className="bg-gray-800 text-gray-400 p-3 rounded-xl rounded-bl-sm">
                            <div className="flex gap-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
