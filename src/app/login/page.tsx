'use client';

// ============================================================
// Login Page
// ============================================================

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/graphql/queries';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [loginMutation, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            login(data.login.token, data.login.user);
            router.push(redirect);
        },
        onError: (error) => {
            setErrors({ general: error.message });
        },
    });

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        loginMutation({ variables: { input: formData } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4">
            {/* Background */}
            <div className="absolute inset-0 hero-gradient pointer-events-none" />

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        B
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100">Welcome back</h1>
                    <p className="text-gray-400 mt-1">Sign in to your BookVerse account</p>
                </div>

                <div className="glass-card p-8">
                    {errors.general && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="login-email">
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                autoComplete="email"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                autoComplete="current-password"
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3"
                            id="login-submit-button"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <p className="text-xs text-indigo-400 font-semibold mb-1">Demo Admin Credentials:</p>
                        <p className="text-xs text-gray-400">Email: admin@bookstore.com</p>
                        <p className="text-xs text-gray-400">Password: admin123456</p>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
