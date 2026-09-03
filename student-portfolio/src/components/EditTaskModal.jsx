import React, { useState, useEffect } from 'react';

/**
 * Modal dialog for editing an existing task's title, description, priority, and completed state.
 */
export default function EditTaskModal({
    isOpen,
    task,
    onClose,
    onSave,
    isSaving = false
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setPriority(task.priority || 'medium');
            setCompleted(Boolean(task.completed));
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave(task._id, {
            title: title.trim(),
            description: description.trim(),
            priority,
            completed
        });
    };

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
                <div className="modal-header">
                    <span className="modal-warning-icon">✏️</span>
                    <h3 className="modal-title">Edit Task</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div>
                            <label className="form-label" htmlFor="edit-task-title">
                                Task Title <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                id="edit-task-title"
                                type="text"
                                className="input-field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label className="form-label" htmlFor="edit-task-desc">
                                Description
                            </label>
                            <textarea
                                id="edit-task-desc"
                                className="input-field"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label" htmlFor="edit-task-priority">
                                    Priority
                                </label>
                                <select
                                    id="edit-task-priority"
                                    className="input-field"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>

                            <div style={{ paddingTop: '1.4rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={completed}
                                        onChange={(e) => setCompleted(e.target.checked)}
                                    />
                                    Mark as Completed
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSaving || !title.trim()}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
