import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamic styles based on state
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#ffffff',
    color: isDarkMode ? '#e2e8f0' : '#0f172a',
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}
