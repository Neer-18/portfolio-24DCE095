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

## Practical 8: Performance Optimization & Lazy Loading in React
**CO / PO Mapping:** CO1 / PO3, PO5  
**Objective:** To improve frontend performance using lazy loading and code splitting techniques in React.

### 📐 Architecture & Chunk Splitting

#### Before Optimization (Monolithic Bundle)
```
Browser Request ──► index.js (258.33 kB) ──► Loads Home, Projects, Contact, TaskManager, Modals upfront
```

#### After Optimization (Route & Component Code-Splitting)
```
Browser Request (/) ──► index.js (232.49 kB) ──► Initial Shell & Routing logic
                    ──► Home.js (0.96 kB)    ──► Loaded immediately for landing page

Navigate to /projects ──► LoadingFallback UI (Spinner)
                      ──► Projects.js (16.19 kB) ──► Loaded asynchronously on demand

Navigate to /contact  ──► LoadingFallback UI (Spinner)
                      ──► Contact.js (3.43 kB)   ──► Loaded asynchronously on demand

User clicks Login     ──► AuthModal.js (4.90 kB) ──► Component-level lazy chunk
User clicks Edit Task ──► EditTaskModal.js (2.87 kB) ──► Component-level lazy chunk
```

---

### 📊 Bundle Size & Network Benchmarks (Measured via Vite 8.2)

| Build Asset / Chunk | Before Optimization | After Optimization | Status / Role |
| :--- | :--- | :--- | :--- |
| **Initial Entry Bundle (`index-*.js`)** | **258.33 kB** (80.86 kB gzip) | **232.49 kB** (74.67 kB gzip) | **Reduced by ~25.84 kB (~6.19 kB gzip)** |
| **Home Route Chunk (`Home-*.js`)** | Inlined in main bundle | **0.96 kB** (0.52 kB gzip) | Lazy-loaded on `/` |
| **Projects Route Chunk (`Projects-*.js`)** | Inlined in main bundle | **16.19 kB** (5.08 kB gzip) | Lazy-loaded on `/projects` or `/tasks` |
| **Contact Route Chunk (`Contact-*.js`)** | Inlined in main bundle | **3.43 kB** (1.31 kB gzip) | Lazy-loaded on `/contact` |
| **NotFound Route Chunk (`NotFound-*.js`)** | Inlined in main bundle | **0.39 kB** (0.28 kB gzip) | Lazy-loaded on wildcard route |
| **Auth Modal Chunk (`AuthModal-*.js`)** | Inlined in main bundle | **4.90 kB** (1.69 kB gzip) | Lazy-loaded on login click |
| **Edit Modal Chunk (`EditTaskModal-*.js`)**| Inlined in main bundle | **2.87 kB** (1.08 kB gzip) | Lazy-loaded on edit task click |
| **Styles Bundle (`index-*.css`)** | 12.56 kB (3.23 kB gzip) | 12.56 kB (3.23 kB gzip) | Consistent styling & CSS variables |

---

### ✨ Key Features Implemented

1. **Route-Level Code Splitting (`App.jsx`)**:
   - Converted standard page imports to dynamic `React.lazy(() => import(...))` statements.
   - Wrapped the entire `<Routes>` block in `<Suspense>` with a centralized fallback component.
   - Preserved shell components (`Header`, `Navbar`, `Footer`) as static imports so navigation remains responsive.

2. **Component-Level Lazy Loading (Supplementary Problem 1)**:
   - Split heavy modals (`AuthModal.jsx` and `EditTaskModal.jsx`) in `TaskManager.jsx` into separate chunks.
   - Wrapped modal triggers with individual `<Suspense fallback={null}>` boundaries, ensuring zero modal JS is loaded until the user opens the dialog.

3. **Theme-Aware Fallback UI with Minimum Delay (Supplementary Problem 2)**:
   - Designed `LoadingFallback.jsx` featuring smooth CSS keyframe rotation (`@keyframes spin`), dark/light theme integration (`var(--accent)`, `var(--bg)`), and accessible ARIA attributes (`role="status"`, `aria-live="polite"`).
   - Includes optional minimum display delay handling to prevent visual screen flickering on ultra-fast networks.

4. **DevTools Profiler & Network Throttling Verification**:
   - Verified fallback rendering by simulating **Slow 3G** throttling in Chrome/Edge DevTools Network tab.
   - Observed deferred chunk downloading waterfall: chunks load only upon route transition.

---

### 🧪 Step-by-Step Testing & Observation Guide

1. **Build Verification**:
   ```bash
   cd student-portfolio
   npm run build
   ```
   Inspect terminal output and confirm the generation of separate chunk files (`Projects-*.js`, `Contact-*.js`, `AuthModal-*.js`, etc.).

2. **Simulating Slower Networks in DevTools**:
   - Run `npm run preview` or `npm run dev`.
   - Open Developer Tools (`F12`), switch to the **Network** tab.
   - Check **Disable cache**, and set Throttling dropdown to **Slow 3G**.
   - Navigate to `http://localhost:5173/`. Notice only `index.js` and `Home.js` are fetched.
   - Click **Projects** in the navigation bar. Observe the `LoadingFallback` spinner appearing while `Projects.js` is requested and loaded over the network.
   - Click **Edit Task** or **Login / Register**. Observe `EditTaskModal.js` or `AuthModal.js` downloading as standalone chunks.

---

### 💡 Viva & Conceptual Understanding

- **Q1: What is the difference between the initial bundle and a lazy-loaded chunk in terms of when each is downloaded?**
  - *Answer:* The initial bundle (`index.js`) must be fetched, parsed, and executed synchronously before the application can render its initial shell. A lazy-loaded chunk is deferred and requested asynchronously via dynamic `import()` only when the user triggers a specific route or interactive modal.

- **Q2: Why does lazy loading improve perceived performance even though the total amount of code downloaded eventually stays the same?**
  - *Answer:* Browsers spend significant time parsing and executing JavaScript. By shrinking the initial bundle, the main browser thread is unblocked sooner, reducing **First Contentful Paint (FCP)** and **Time to Interactive (TTI)**. Users receive an interactive interface immediately, while secondary pages are fetched in the background or on demand.

- **Q3: In what situations would lazy loading not be worth the added complexity?**
  - *Answer:* In very small applications (e.g., total JS < 100 kB), code splitting introduces unnecessary HTTP request overhead, minor bundle bloat from module loader runtime code, and unwanted loading state flickers without measurable user performance gains.

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