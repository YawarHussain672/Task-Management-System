'use client';

import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.icon}>
                    {isDestructive ? '⚠️' : 'ℹ️'}
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmBtn} ${isDestructive ? styles.destructive : ''}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
