'use client';

import { useState } from 'react';
import { Flame, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login, signup, signInWithMagicLink } from '@/actions/auth';

type Mode = 'login' | 'signup' | 'magic';

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [magicSent, setMagicSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            if (mode === 'signup') {
                formData.append('username', username);
            }

            const result = mode === 'login' ? await login(formData) : await signup(formData);

            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async () => {
        if (!email) {
            setError('Enter your email first');
            return;
        }
        setLoading(true);
        setError('');

        const result = await signInWithMagicLink(email);

        if (result.error) {
            setError(result.error);
        } else {
            setMagicSent(true);
        }
        setLoading(false);
    };

    if (magicSent) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-6">📬</div>
                <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                <p className="text-gray-400 text-center mb-6">
                    We sent a magic link to <span className="text-primary">{email}</span>
                </p>
                <button
                    onClick={() => setMagicSent(false)}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    Use a different email
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            {/* Logo */}
            <div className="text-5xl mb-4 animate-bounce">🔥</div>
            <h1 className="text-3xl font-bold text-white mb-2">BroGigaChad</h1>
            <p className="text-gray-400 mb-8">
                {mode === 'login' ? 'Welcome back, grinder' : 'Join the grind'}
            </p>

            {/* Error */}
            {error && (
                <div className="w-full max-w-sm mb-4 p-3 bg-danger/20 border border-danger/30 rounded-lg text-danger text-sm text-center">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                {mode === 'signup' && (
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                            required
                        />
                    </div>
                )}

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-gray-700 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            {mode === 'login' ? 'Login' : 'Sign Up'}
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            {/* Magic Link */}
            <div className="w-full max-w-sm mt-4">
                <button
                    onClick={handleMagicLink}
                    disabled={loading}
                    className="w-full py-3 bg-surface hover:bg-surface-alt border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                >
                    ✨ Send Magic Link Instead
                </button>
            </div>

            {/* Switch Mode */}
            <div className="mt-6 text-gray-500 text-sm">
                {mode === 'login' ? (
                    <>
                        New here?{' '}
                        <button onClick={() => setMode('signup')} className="text-primary hover:underline">
                            Sign up
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <button onClick={() => setMode('login')} className="text-primary hover:underline">
                            Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
