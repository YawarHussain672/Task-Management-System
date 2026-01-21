const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Token management
export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// Refresh token helper
const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            clearTokens();
            return null;
        }

        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
    } catch {
        clearTokens();
        return null;
    }
};

// API request helper with automatic token refresh
export const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    let accessToken = getAccessToken();

    const makeRequest = async (token: string | null): Promise<Response> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        return fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
    };

    let response = await makeRequest(accessToken);

    // If unauthorized, try to refresh token
    if (response.status === 401 && accessToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            response = await makeRequest(newToken);
        }
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
};

// Auth API
export const authApi = {
    register: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        return data;
    },

    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        setTokens(data.accessToken, data.refreshToken);
        return data;
    },

    logout: async () => {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } catch {
            // Ignore errors on logout
        }
        clearTokens();
    },
};

// Tasks API
import { TasksResponse, Task, CreateTaskInput, UpdateTaskInput } from '@/types';

export const tasksApi = {
    getTasks: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }): Promise<TasksResponse> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.status) searchParams.set('status', params.status);
        if (params?.search) searchParams.set('search', params.search);

        const queryString = searchParams.toString();
        return apiRequest<TasksResponse>(`/tasks${queryString ? `?${queryString}` : ''}`);
    },

    getTask: async (id: string): Promise<{ task: Task }> => {
        return apiRequest<{ task: Task }>(`/tasks/${id}`);
    },

    createTask: async (data: CreateTaskInput): Promise<{ message: string; task: Task }> => {
        return apiRequest<{ message: string; task: Task }>('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateTask: async (id: string, data: UpdateTaskInput): Promise<{ message: string; task: Task }> => {
        return apiRequest<{ message: string; task: Task }>(`/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteTask: async (id: string): Promise<{ message: string }> => {
        return apiRequest<{ message: string }>(`/tasks/${id}`, {
            method: 'DELETE',
        });
    },

    toggleTask: async (id: string): Promise<{ message: string; task: Task }> => {
        return apiRequest<{ message: string; task: Task }>(`/tasks/${id}/toggle`, {
            method: 'POST',
        });
    },
};
