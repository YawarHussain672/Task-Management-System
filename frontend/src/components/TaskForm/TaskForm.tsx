'use client';

import React, { useState, useEffect } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types';
import styles from './TaskForm.module.css';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
    onClose: () => void;
}

export const TaskForm = ({ task, onSubmit, onClose }: TaskFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ title: title.trim(), description: description.trim(), status });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={4}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={!title.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
