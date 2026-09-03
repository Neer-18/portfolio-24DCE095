# Student Portfolio Website

A multi-page React application showcasing skills, projects, and contacts, built using **React, Vite, and React Router**.

---

## Practical 3: API Integration & Data Rendering in React

This version integrates a public REST API to dynamically load, search, and manage project repositories.

### 🔌 API Integration
- **Endpoint**: [GitHub REST API](https://docs.github.com/en/rest/repos) (`https://api.github.com/users/<username>/repos`)
- **Default Profile**: `Neer-18`

### ✨ Features Implemented
1. **Dynamic Data Fetching**: Fetches public GitHub repositories automatically on component mount using a rate-limit safe React `useEffect` hook.
2. **Rate Limit Protection**: Employs a controlled input field for search usernames, triggering a new API call only when clicking **Load User** or pressing **Enter**.
3. **Client-Side Filtering**: Supports real-time filtering of loaded repositories using a local search input and JavaScript's `.filter()` method (no extra API calls).
4. **Interactive Error Simulation & Recovery**:
   - A toggle checkbox to simulate network/URL failures (returns `404`).
   - A descriptive `.error-container` state display to prevent app crashes.
   - An active **Try Again** button that resets states and re-runs the API call.
5. **Premium Glassmorphic CSS Styling**:
   - Circular rotating `@keyframes spin` loading animation.
   - Smooth hover scaling and neon glow shadows on repository cards.
   - Fully synchronized dark/light mode CSS custom variables.

---

## Practical 6: Full Stack Integration (React + Node + MongoDB)

This practical wires the React frontend with the Node.js/Express REST API and MongoDB Atlas cloud database to form a persistent, production-grade full-stack application.

### 📐 Full Stack Architecture Flow
```
┌──────────────────────────────────────────────────────────┐
│             React Frontend (localhost:5173)              │
│  - TaskManager Component                                 │
│  - Optimistic UI State Updates                           │
│  - Toast Notifications & Confirm Dialog Modal            │
└────────────────────────────┬─────────────────────────────┘
                             │ fetch API calls (CORS enabled)
                             ▼
┌──────────────────────────────────────────────────────────┐
│             Express Backend (localhost:5000)             │
│  - cors() middleware                                     │
│  - Request logger & Content-Type validation              │
│  - REST CRUD Routes: /tasks, /tasks/:id                  │
└────────────────────────────┬─────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 MongoDB Atlas Database                   │
│  - Persistent tasks collection                           │
│  - Schema validation & pre-save hooks                    │
└──────────────────────────────────────────────────────────┘
```

### ⚡ Key Features & Implementation
1. **Central API Service (`src/api.js`)**:
   - Single point of truth for base backend URL (`http://localhost:5000`).
   - Clean async methods: `getTasks()`, `getTaskById()`, `createTask()`, `updateTask()`, and `deleteTask()`.
   - Comprehensive error response parsing and network boundary diagnostics.
2. **Complete Full-Stack CRUD Actions**:
   - **Create**: Add new tasks with `title`, `description`, and `priority` (`low`, `medium`, `high`).
   - **Read**: Fetch and display tasks sorted by creation date with live count badges (Total, Pending, Completed).
   - **Update**: Toggle completion status immediately and edit title/description/priority through an interactive edit modal.
   - **Delete**: Remove tasks from MongoDB Atlas with state cleanup.
   - **Persistence**: All data persists in MongoDB Atlas—refreshing the browser (F5) retains data.
3. **Supplementary Enhancements**:
   - **Optimistic UI Updates**: Newly added tasks immediately render in the UI with a distinct syncing badge before server confirmation. If the server rejects the write, state is rolled back and an error toast appears.
   - **Delete Confirmation Dialog (`ConfirmModal.jsx`)**: Accessible modal dialog with backdrop blur and keyboard escape dismissal confirming before any deletion.
   - **Toast Notifications (`Toast.jsx`)**: Non-intrusive floating feedback alerts for create, update, delete, and error events with auto-dismiss timers.
   - **Search & Multi-Filter**: Filter tasks in real time by completion status, priority level, or search keyword.

---

## 🛠️ Setup and Running Both Servers Locally

To run the complete full-stack application, run the backend and frontend in separate terminals:

### Step 1: Start the Backend (Terminal 1)
```bash
cd task-manager-api-24DCE095
npm install
npm run dev
```
The Express server starts on `http://localhost:5000` and connects to MongoDB Atlas.

### Step 2: Start the React Frontend (Terminal 2)
```bash
cd portfolio-24DCE095/student-portfolio
npm install
npm run dev
```
The React development server runs on `http://localhost:5173`. Open `http://localhost:5173/tasks` to use the application.

---

## 🛠️ Setup and Installation (Frontend Only)

Follow these steps to run the portfolio application locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Neer-18/portfolio-24DCE095.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd portfolio-24DCE095/student-portfolio
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```