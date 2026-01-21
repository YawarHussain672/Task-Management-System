'use client';

import React from 'react';
import { Task } from '@/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

const statusLabels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
};

const statusIcons = {
    PENDING: '○',
    IN_PROGRESS: '◐',
    COMPLETED: '●',
};

export const TaskCard = ({ task, onEdit, onDelete, onToggle }: TaskCardProps) => {
    return (
        <div className={`${styles.card} ${styles[task.status.toLowerCase()]}`}>
            <div className={styles.header}>
                <button
                    className={styles.statusBtn}
                    onClick={() => onToggle(task.id)}
                    title="Toggle status"
                >
                    <span className={styles.statusIcon}>{statusIcons[task.status]}</span>
                    <span className={styles.statusLabel}>{statusLabels[task.status]}</span>
                </button>
                <div className={styles.actions}>
                    <button
                        className={styles.editBtn}
                        onClick={() => onEdit(task)}
                        title="Edit task"
                    >
                        ✎
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => onDelete(task.id)}
                        title="Delete task"
                    >
                        🗑
                    </button>
                </div>
            </div>
            <h3 className={styles.title}>{task.title}</h3>
            {task.description && (
                <p className={styles.description}>{task.description}</p>
            )}
            <div className={styles.footer}>
                <span className={styles.date} suppressHydrationWarning>
                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
            </div>
        </div>
    );
};
