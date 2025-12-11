'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Twitter, MessageCircle, Link } from 'lucide-react';

interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
}

export default function ShareButton({
    title = 'BroGigaChad',
    text = "I'm grinding with BroGigaChad - the TopG productivity app! ðŸ”¥",
    url = typeof window !== 'undefined' ? window.location.href : ''
}: ShareButtonProps) {
    const [showOptions, setShowOptions] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                setShowOptions(true);
            }
        } else {
            setShowOptions(true);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    };

    const shareToWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="p-2 bg-surface border border-gray-700 rounded-lg hover:border-primary transition-colors"
            >
                <Share2 size={20} className="text-gray-400" />
            </button>

            {showOptions && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowOptions(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-surface border border-gray-700 rounded-xl p-2 z-50 min-w-[180px] shadow-lg">
                        <button
                            onClick={shareToTwitter}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Twitter size={18} className="text-blue-400" />
                            <span className="text-white text-sm">Twitter/X</span>
                        </button>
                        <button
                            onClick={shareToWhatsApp}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <MessageCircle size={18} className="text-green-400" />
                            <span className="text-white text-sm">WhatsApp</span>
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check size={18} className="text-success" />
                                    <span className="text-success text-sm">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Link size={18} className="text-gray-400" />
                                    <span className="text-white text-sm">Copy Link</span>
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
