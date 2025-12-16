'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Send } from 'lucide-react';
import PostCard from '@/components/social/PostCard';
import BottomNav from '@/components/BottomNav';

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

export default function SocialFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        setIsPosting(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newPostContent, type: 'FLEX' })
            });

            if (res.ok) {
                setNewPostContent('');
                setIsCreating(false);
                fetchPosts(); // Refresh feed
            }
        } catch (error) {
            console.error('Failed to create post', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-4 sticky top-0 z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-white">Social Feed</h1>
                    <p className="text-gray-400 text-xs">Flex your gains 💪</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-primary hover:bg-primary-hover text-white p-2 rounded-full transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Create Post Area */}
            {isCreating && (
                <div className="p-4 bg-surface border-b border-white/5 animate-slide-up">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What did you achieve today?"
                        className="w-full bg-surface-alt text-white p-3 rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-gray-400 text-sm px-3 py-1 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreatePost}
                            disabled={isPosting || !newPostContent.trim()}
                            className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPosting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            Post
                        </button>
                    </div>
                </div>
            )}

            {/* Feed */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No posts yet. Be the first to flex!</p>
                    </div>
                )}
            </div>

            <BottomNav currentScreen="social" />
        </div>
    );
}
