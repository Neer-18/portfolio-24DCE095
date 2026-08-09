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

## 🛠️ Setup and Installation

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