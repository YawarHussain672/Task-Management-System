export interface User {
    id: string;
    email: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TasksResponse {
    tasks: Task[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ApiError {
    error: string;
    errors?: Array<{ msg: string; path: string }>;
}
