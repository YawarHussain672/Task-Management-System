'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/Toast/Toast';
import { tasksApi } from '@/lib/api';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import { TaskForm } from '@/components/TaskForm/TaskForm';
import { FilterBar } from '@/components/FilterBar/FilterBar';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
    const { showToast } = useToast();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await tasksApi.getTasks({
                page,
                limit: 10,
                status: status || undefined,
                search: search || undefined,
            });
            setTasks(response.tasks);
            setTotalPages(response.pagination.totalPages);
        } catch (err: any) {
            showToast(err.message || 'Failed to load tasks', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [page, status, search, showToast]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated, fetchTasks]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                setPage(1);
                fetchTasks();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleCreateTask = async (data: CreateTaskInput) => {
        try {
            await tasksApi.createTask(data);
            showToast('Task created successfully', 'success');
            fetchTasks();
        } catch (err: any) {
            showToast(err.message || 'Failed to create task', 'error');
        }
    };

    const handleUpdateTask = async (data: UpdateTaskInput) => {
        if (!editingTask) return;
        try {
            await tasksApi.updateTask(editingTask.id, data);
            showToast('Task updated successfully', 'success');
            fetchTasks();
        } catch (err: any) {
            showToast(err.message || 'Failed to update task', 'error');
        }
    };

    const handleDeleteTask = async (id: string) => {
        setDeleteTaskId(id);
    };

    const confirmDelete = async () => {
        if (!deleteTaskId) return;
        try {
            await tasksApi.deleteTask(deleteTaskId);
            showToast('Task deleted successfully', 'success');
            fetchTasks();
        } catch (err: any) {
            showToast(err.message || 'Failed to delete task', 'error');
        } finally {
            setDeleteTaskId(null);
        }
    };

    const handleToggleTask = async (id: string) => {
        try {
            await tasksApi.toggleTask(id);
            fetchTasks();
        } catch (err: any) {
            showToast(err.message || 'Failed to toggle task', 'error');
        }
    };

    const handleLogout = async () => {
        await logout();
        showToast('Logged out successfully', 'info');
        router.push('/login');
    };

    if (authLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <span className={styles.logo}>✓</span>
                    <h1>TaskFlow</h1>
                </div>
                <div className={styles.userMenu}>
                    <span className={styles.email}>{user?.email}</span>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.titleSection}>
                    <h2>My Tasks</h2>
                    <p>Manage and organize your work</p>
                </div>

                <FilterBar
                    search={search}
                    status={status}
                    onSearchChange={setSearch}
                    onStatusChange={(val) => {
                        setStatus(val);
                        setPage(1);
                    }}
                    onAddTask={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                />

                {isLoading ? (
                    <div className={styles.loadingTasks}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>📝</span>
                        <h3>No tasks found</h3>
                        <p>
                            {search || status
                                ? 'Try adjusting your filters'
                                : 'Create your first task to get started'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className={styles.taskGrid}>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={(t) => {
                                        setEditingTask(t);
                                        setShowForm(true);
                                    }}
                                    onDelete={handleDeleteTask}
                                    onToggle={handleToggleTask}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    ← Previous
                                </button>
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {showForm && (
                <TaskForm
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onClose={() => {
                        setShowForm(false);
                        setEditingTask(null);
                    }}
                />
            )}

            <ConfirmModal
                isOpen={deleteTaskId !== null}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTaskId(null)}
            />
        </div>
    );
}
