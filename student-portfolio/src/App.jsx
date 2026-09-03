import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

export default function App() {
  // Initialize state based on system color scheme preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Synchronize CSS class with dark mode state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic styles utilizing theme variables
  const themeStyles = {
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background-color 0.3s ease, color 0.3s ease'
  };

  return (
    <div style={themeStyles}>
      <Header name="Neer Patel" themeColor="#1d4ed8" />
      <Navbar />

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '4px' }}
        >
          {isDarkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
        </button>
      </div>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
