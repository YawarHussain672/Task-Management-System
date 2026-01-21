'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast/Toast';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password);
            showToast('Account created! Please sign in.', 'success');
            router.push('/login');
        } catch (err: any) {
            showToast(err.message || 'Registration failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>✓</div>
                    <h1>Create Account</h1>
                    <p>Start managing your tasks today</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
