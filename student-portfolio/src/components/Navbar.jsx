import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', background: '#1e293b', padding: '0.75rem' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
            <Link to="/tasks" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Tasks</Link>
            <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link>
        </nav>
    );
}