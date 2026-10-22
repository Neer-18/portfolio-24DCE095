/**
 * Central API Client for Task Manager Backend (Practicals 6 & 7)
 * Base URL: http://localhost:5000
 * Handles JWT Token Persistence, Authorization Headers, and 401 Expiry Events
 */
const BASE_URL = 'http://localhost:5000';

export const getStoredToken = () => localStorage.getItem('jwt_token');
export const setStoredToken = (token) => localStorage.setItem('jwt_token', token);
export const removeStoredToken = () => localStorage.removeItem('jwt_token');

/**
 * Safe fetch wrapper that automatically attaches JWT Authorization header
 * and catches network connection errors
 */
async function safeFetch(url, options = {}) {
    const headers = {
        ...(options.headers || {})
    };

    // Attach JWT Bearer token if present
    const token = getStoredToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        // Supplementary Problem 2: Token expiry & tampering handling (401 & 403)
        if (response.status === 401 || response.status === 403) {
            removeStoredToken();
            window.dispatchEvent(new CustomEvent('auth:expired'));
        }

        return response;
    } catch (err) {
        throw new Error(
            "Network Error: Failed to connect to server on http://localhost:5000. Ensure the Express backend is running."
        );
    }
}

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

// ==========================================
// --- AUTHENTICATION API (Practical 7) ---
// ==========================================

/**
 * Register a new user
 * POST /register
 */
export async function registerUser(userData) {
    const response = await safeFetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
}

/**
 * Log in an existing user and save token
 * POST /login
 */
export async function loginUser(credentials) {
    const response = await safeFetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    if (data.token) {
        setStoredToken(data.token);
    }
    return data;
}

/**
 * Fetch currently authenticated user's profile (Supplementary Problem 1)
 * GET /me
 */
export async function getCurrentUser() {
    const response = await safeFetch(`${BASE_URL}/me`);
    return handleResponse(response);
}

/**
 * Clear user token and log out (Supplementary Problem 3)
 */
export function logoutUser() {
    removeStoredToken();
    window.dispatchEvent(new CustomEvent('auth:logout'));
}

// ===================================
// --- TASK CRUD API (Protected) ---
// ===================================

/**
 * Fetch all tasks for authenticated user
 * GET /tasks
 */
export async function getTasks() {
    const response = await safeFetch(`${BASE_URL}/tasks`);
    return handleResponse(response);
}

/**
 * Fetch a single task by ID
 * GET /tasks/:id
 */
export async function getTaskById(id) {
    const response = await safeFetch(`${BASE_URL}/tasks/${id}`);
    return handleResponse(response);
}

/**
 * Create a new task in MongoDB
 * POST /tasks
 */
export async function createTask(taskData) {
    const response = await safeFetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    return handleResponse(response);
}

/**
 * Update an existing task in MongoDB
 * PUT /tasks/:id
 */
export async function updateTask(id, updateData) {
    const response = await safeFetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
    });
    return handleResponse(response);
}

/**
 * Delete a task from MongoDB
 * DELETE /tasks/:id
 */
export async function deleteTask(id) {
    const response = await safeFetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    return handleResponse(response);
}

/**
 * Practical 13: Generate AI Task Description
 * POST /api/ai/generate-description
 */
export async function generateAiDescription(title) {
    const response = await safeFetch(`${BASE_URL}/api/ai/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    return handleResponse(response);
}

export default {
    getStoredToken,
    setStoredToken,
    removeStoredToken,
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    generateAiDescription
};
