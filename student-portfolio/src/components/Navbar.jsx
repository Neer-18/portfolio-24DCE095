export default function Navbar() {
    return (
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', background: '#1e293b', padding: '0.75rem' }}>
            <a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>About</a>
            <a href="#skills" style={{ color: '#fff', textDecoration: 'none' }}>Skills</a>
            <a href="#projects" style={{ color: '#fff', textDecoration: 'none' }}>Projects</a>
        </nav>
    );
}