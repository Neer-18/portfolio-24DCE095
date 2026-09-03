import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import EditTaskModal from './EditTaskModal';

export default function TaskManager() {
    // Core data states
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form inputs for new task
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPriority, setNewPriority] = useState('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search and filter controls
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'
    const [filterPriority, setFilterPriority] = useState('all'); // 'all' | 'low' | 'medium' | 'high'

    // Interactive Modals and Toast notifications
    const [toasts, setToasts] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Helper to add toast with auto-removal
    const showToast = useCallback((type, message) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 6);
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3800);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // 1. Fetch tasks from backend on mount or retry
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTasks();
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                throw new Error("Invalid format received from server.");
            }
        } catch (err) {
            setError(
                err.message ||
                "Failed to connect to backend on http://localhost:5000. Ensure your Express server is running."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // 2. Task Creation with OPTIMISTIC UI Update (Supplementary Problem 1)
    const handleCreateTask = async (e) => {
        e.preventDefault();
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) {
            showToast('error', 'Task title cannot be empty.');
            return;
        }

        const trimmedDesc = newDescription.trim();
        const selectedPriority = newPriority;

        // Temporary optimistic object shown immediately in UI
        const tempId = `optimistic-${Date.now()}`;
        const optimisticTask = {
            _id: tempId,
            title: trimmedTitle,
            description: trimmedDesc,
            priority: selectedPriority,
            completed: false,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        // Instantly prepend to UI state
        setTasks((prev) => [optimisticTask, ...prev]);
        setNewTitle('');
        setNewDescription('');
        setNewPriority('medium');
        setIsSubmitting(true);

        try {
            // Write to MongoDB backend
            const serverTask = await createTask({
                title: trimmedTitle,
                description: trimmedDesc,
                priority: selectedPriority
            });

            // Replace optimistic task with confirmed MongoDB document
            setTasks((prev) =>
                prev.map((t) => (t._id === tempId ? serverTask : t))
            );
            showToast('success', `Task "${serverTask.title}" created and saved to MongoDB!`);
        } catch (err) {
            // Roll back the optimistic update if server write fails
            setTasks((prev) => prev.filter((t) => t._id !== tempId));
            setNewTitle(trimmedTitle);
            setNewDescription(trimmedDesc);
            showToast('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Toggle Completion Status (PUT /tasks/:id)
    const handleToggleComplete = async (task) => {
        const nextCompleted = !task.completed;
        const previousCompleted = task.completed;

        // Optimistic local update
        setTasks((prev) =>
            prev.map((t) =>
                t._id === task._id ? { ...t, completed: nextCompleted } : t
            )
        );

        try {
            const updated = await updateTask(task._id, { completed: nextCompleted });
            setTasks((prev) =>
                prev.map((t) => (t._id === task._id ? updated : t))
            );
            showToast(
                'info',
                `Task marked as ${nextCompleted ? 'Completed ✅' : 'Active ⏳'}`
            );
        } catch (err) {
            // Revert on error
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === task._id ? { ...t, completed: previousCompleted } : t
                )
            );
            showToast('error', `Failed to update task: ${err.message}`);
        }
    };

    // 4. Edit Task (PUT /tasks/:id)
    const handleSaveEdit = async (id, updatedFields) => {
        setIsSavingEdit(true);
        try {
            const updated = await updateTask(id, updatedFields);
            setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
            setEditTarget(null);
            showToast('success', `Task "${updated.title}" updated successfully!`);
        } catch (err) {
            showToast('error', `Update failed: ${err.message}`);
        } finally {
            setIsSavingEdit(false);
        }
    };

    // 5. Delete Task with Confirmation Dialog (Supplementary Problem 2)
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteTask(deleteTarget._id);
            setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
            showToast('success', `Task "${deleteTarget.title}" permanently deleted.`);
            setDeleteTarget(null);
        } catch (err) {
            showToast('error', `Failed to delete task: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter and search logic
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            filterStatus === 'all'
                ? true
                : filterStatus === 'completed'
                ? task.completed
                : !task.completed;

        const matchesPriority =
            filterPriority === 'all'
                ? true
                : task.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = totalCount - completedCount;

    return (
        <section className="task-manager-section" style={{ padding: '2rem 1rem', maxWidth: '1050px', margin: '0 auto' }}>
            {/* Notification Toasts */}
            <Toast toasts={toasts} onClose={removeToast} />

            {/* Header / Intro */}
            <div className="task-header-block">
                <span className="p6-badge">Practical 6: Full Stack Integration</span>
                <h1 style={{ margin: '0.5rem 0', lineHeight: 1.2 }}>Full Stack Task Manager</h1>
                <p style={{ color: 'var(--text)', margin: '0 0 1.75rem 0', fontSize: '1rem' }}>
                    Connected live to Express API (<code>http://localhost:5000/tasks</code>) &amp; MongoDB Atlas.
                    Changes are persisted in the cloud database.
                </p>
            </div>

            {/* Statistics Dashboard Banner */}
            <div className="task-stats-bar">
                <div className="stat-pill">
                    <span className="stat-label">Total Tasks:</span>
                    <strong className="stat-value">{totalCount}</strong>
                </div>
                <div className="stat-pill stat-pending">
                    <span className="stat-label">⏳ Pending:</span>
                    <strong className="stat-value">{pendingCount}</strong>
                </div>
                <div className="stat-pill stat-completed">
                    <span className="stat-label">✅ Completed:</span>
                    <strong className="stat-value">{completedCount}</strong>
                </div>
            </div>

            {/* Task Creation Form Card */}
            <div className="task-form-card">
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', textAlign: 'left', color: 'var(--text-h)' }}>
                    ➕ Add New Task
                </h2>
                <form onSubmit={handleCreateTask} className="task-form">
                    <div className="form-row">
                        <div className="form-col-title">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="What needs to be done? (e.g. Wire React to MongoDB)"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <div className="form-col-priority">
                            <select
                                className="input-field"
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="low">🟢 Low Priority</option>
                                <option value="medium">🟡 Medium Priority</option>
                                <option value="high">🔴 High Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row" style={{ marginTop: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Optional description or details..."
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting || !newTitle.trim()}
                            style={{ minWidth: '130px' }}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter and Search Bar */}
            <div className="task-filter-bar">
                <div className="search-box" style={{ flex: 1, minWidth: '220px' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="🔍 Search tasks by title or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                <div className="filter-group">
                    <select
                        className="input-field"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">⏳ Pending Only</option>
                        <option value="completed">✅ Completed Only</option>
                    </select>

                    <select
                        className="input-field"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                    </select>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={fetchTasks}
                        title="Re-fetch tasks from MongoDB"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Conditional Data States */}
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p style={{ fontWeight: '500', color: 'var(--text-h)' }}>
                        Connecting to Node/MongoDB backend...
                    </p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <h3 className="error-title">⚠️ Backend Connection Failed</h3>
                    <p className="error-message">{error}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
                        Make sure the Express backend server is running in a terminal:
                        <br />
                        <code>cd task-manager-api-24DCE095 &amp;&amp; npm run dev</code>
                    </p>
                    <button className="btn-retry" onClick={fetchTasks}>
                        🔄 Try Again
                    </button>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="empty-tasks-card">
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>📋</span>
                    <h3 style={{ color: 'var(--text-h)', margin: '0 0 0.5rem' }}>
                        {tasks.length === 0 ? 'No tasks found in MongoDB!' : 'No tasks match your filter.'}
                    </h3>
                    <p style={{ color: 'var(--text)', margin: 0 }}>
                        {tasks.length === 0
                            ? 'Create your first task above to test end-to-end full-stack persistence.'
                            : 'Try adjusting your search keywords or resetting filters.'}
                    </p>
                </div>
            ) : (
                <div className="task-grid">
                    {filteredTasks.map((task) => {
                        const isOptimistic = Boolean(task.isOptimistic);
                        const priorityClass = `priority-${task.priority || 'medium'}`;

                        return (
                            <div
                                key={task._id}
                                className={`task-card ${task.completed ? 'task-completed' : ''} ${
                                    isOptimistic ? 'task-optimistic' : ''
                                }`}
                            >
                                <div className="task-card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            className="task-checkbox"
                                            checked={Boolean(task.completed)}
                                            onChange={() => handleToggleComplete(task)}
                                            disabled={isOptimistic}
                                            title="Click to toggle status"
                                        />
                                        <span className={`task-priority-badge ${priorityClass}`}>
                                            {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
                                        </span>
                                    </div>
                                    {isOptimistic ? (
                                        <span className="optimistic-pill" title="Optimistic update - syncing with MongoDB">
                                            Syncing...
                                        </span>
                                    ) : (
                                        <span className="task-date">
                                            {task.createdAt
                                                ? new Date(task.createdAt).toLocaleDateString(undefined, {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                  })
                                                : 'Just now'}
                                        </span>
                                    )}
                                </div>

                                <div className="task-card-body">
                                    <h3
                                        className={`task-title ${
                                            task.completed ? 'task-title-struck' : ''
                                        }`}
                                    >
                                        {task.title}
                                    </h3>
                                    {task.description && (
                                        <p className="task-desc">{task.description}</p>
                                    )}
                                </div>

                                <div className="task-card-footer">
                                    <button
                                        type="button"
                                        className="btn-link"
                                        onClick={() => handleToggleComplete(task)}
                                        disabled={isOptimistic}
                                    >
                                        {task.completed ? 'Mark Pending' : 'Mark Done'}
                                    </button>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            className="btn-card-action btn-edit"
                                            onClick={() => setEditTarget(task)}
                                            disabled={isOptimistic}
                                            title="Edit Task"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-card-action btn-delete"
                                            onClick={() => setDeleteTarget(task)}
                                            disabled={isOptimistic}
                                            title="Delete Task"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Supplementary 2: Confirmation Dialog for Deletion */}
            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete Task"
                message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove the document from MongoDB Atlas.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                isProcessing={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {/* Task Edit Modal */}
            <EditTaskModal
                isOpen={Boolean(editTarget)}
                task={editTarget}
                onClose={() => setEditTarget(null)}
                onSave={handleSaveEdit}
                isSaving={isSavingEdit}
            />
        </section>
    );
}
