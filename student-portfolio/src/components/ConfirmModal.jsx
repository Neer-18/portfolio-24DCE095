import React, { useEffect } from 'react';

/**
 * Confirmation Modal Component for Critical Actions (Delete)
 */
export default function ConfirmModal({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isProcessing = false
}) {
    // Dismiss on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !isProcessing) {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isProcessing, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-warning-icon">⚠️</span>
                    <h3 className="modal-title">{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
