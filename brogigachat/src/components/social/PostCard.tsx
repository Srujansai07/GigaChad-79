'use client';

import { useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
    id: string;
    content: string;
    createdAt: string;
    type: 'FLEX' | 'ACHIEVEMENT' | 'UPDATE';
    user: {
        username: string;
        level: number;
    };
    _count: {
        likes: number;
        comments: number;
    };
    isLiked: boolean;
}

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post._count.likes);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    const handleLike = async () => {
        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 300);

        try {
            await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
        } catch (error) {
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    return (
        <div className="bg-surface border border-white/5 rounded-xl p-4 mb-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-lg font-bold text-gray-400">
                    {post.user.username[0].toUpperCase()}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{post.user.username}</span>
                        <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                            Lvl {post.user.level}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                </div>
            </div>

            {/* Content */}
            <p className="text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-6 text-gray-400">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-white'}`}
                >
                    <Heart
                        size={20}
                        className={`${isLiked ? 'fill-current' : ''} ${isLikeAnimating ? 'animate-bounce-subtle' : ''}`}
                    />
                    <span className="text-sm">{likesCount}</span>
                </button>

                <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageSquare size={20} />
                    <span className="text-sm">{post._count.comments}</span>
                </button>

                <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                    <Share2 size={20} />
                </button>
            </div>
        </div>
    );
}
