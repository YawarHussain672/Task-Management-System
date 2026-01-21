'use client';

import React from 'react';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    search: string;
    status: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onAddTask: () => void;
}

export const FilterBar = ({
    search,
    status,
    onSearchChange,
    onStatusChange,
    onAddTask,
}: FilterBarProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className={styles.statusSelect}
                >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>
            <button className={styles.addBtn} onClick={onAddTask}>
                <span>+</span> Add Task
            </button>
        </div>
    );
};
