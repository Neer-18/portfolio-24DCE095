import React from 'react';

/**
 * Toast Notification Container & Component
 * Types: 'success' | 'error' | 'info'
 */
export default function Toast({ toasts, onClose }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <aside
            className="toast-container"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Notification banners"
        >
            {toasts.map((toast) => {
                const isSuccess = toast.type === 'success';
                const isError = toast.type === 'error';

                return (
                    <div
                        key={toast.id}
                        className={`toast-item toast-${toast.type || 'info'}`}
                        role="status"
                    >
                        <span className="toast-icon" aria-hidden="true">
                            {isSuccess ? '✅' : isError ? '❌' : 'ℹ️'}
                        </span>
                        <div className="toast-content">
                            <strong className="toast-title">
                                {isSuccess ? 'Success' : isError ? 'Error' : 'Notice'}
                            </strong>
                            <p className="toast-message">{toast.message}</p>
                        </div>
                        <button
                            type="button"
                            className="toast-close"
                            onClick={() => onClose(toast.id)}
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </aside>
    );
}
