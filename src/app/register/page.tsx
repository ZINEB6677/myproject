'use client';

// ============================================================
// Register Page
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { REGISTER } from '@/graphql/queries';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [registerMutation, { loading }] = useMutation(REGISTER, {
        onCompleted: (data) => {
            login(data.register.token, data.register.user);
            router.push('/');
        },
        onError: (error) => {
            setErrors({ general: error.message });
        },
    });

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        registerMutation({
            variables: {
                input: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                },
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-12">
            <div className="absolute inset-0 hero-gradient pointer-events-none" />

            <div className="w-full max-w-md relative">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        B
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100">Create your account</h1>
                    <p className="text-gray-400 mt-1">Join Kunooz and start reading</p>
                </div>

                <div className="glass-card p-8">
                    {errors.general && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-name">Full Name</label>
                            <input
                                id="reg-name"
                                type="text"
                                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                autoComplete="name"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-email">Email Address</label>
                            <input
                                id="reg-email"
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
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-password">Password</label>
                            <input
                                id="reg-password"
                                type="password"
                                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                autoComplete="new-password"
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-confirm-password">Confirm Password</label>
                            <input
                                id="reg-confirm-password"
                                type="password"
                                className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3"
                            id="register-submit-button"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
