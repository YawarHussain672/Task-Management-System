'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authApi, getAccessToken, clearTokens } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = getAccessToken();
        if (token) {
            // Decode token to get user info (basic JWT decode)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.userId, email: payload.email });
            } catch {
                clearTokens();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        setUser(response.user);
    };

    const register = async (email: string, password: string) => {
        await authApi.register(email, password);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
