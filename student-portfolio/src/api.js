/**
 * Central API Client for Task Manager Backend (Practical 6)
 * Base URL: http://localhost:5000
 */
const BASE_URL = 'http://localhost:5000';

/**
 * Helper to handle fetch responses and parse error messages
 */
async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            }
            if (errorData.details) {
                const detailedMessages = Object.values(errorData.details).join(', ');
                errorMessage += `: ${detailedMessages}`;
            }
        } catch {
            // Could not parse JSON error, keep default status message
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

/**
 * Fetch all tasks from MongoDB
 * GET /tasks
 */
export async function getTasks() {
    const response = await fetch(`${BASE_URL}/tasks`);
    return handleResponse(response);
}

/**
 * Fetch a single task by ID
 * GET /tasks/:id
 */
export async function getTaskById(id) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`);
    return handleResponse(response);
}

/**
 * Create a new task in MongoDB
 * POST /tasks
 */
export async function createTask(taskData) {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    return handleResponse(response);
}

/**
 * Update an existing task in MongoDB
 * PUT /tasks/:id
 */
export async function updateTask(id, updateData) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    return handleResponse(response);
}

/**
 * Delete a task from MongoDB
 * DELETE /tasks/:id
 */
export async function deleteTask(id) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    return handleResponse(response);
}

export default {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
