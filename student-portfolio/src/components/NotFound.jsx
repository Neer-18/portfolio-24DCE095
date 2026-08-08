import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <p>The route you are looking for does not exist.</p>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>Return to Home</Link>
        </section>
    );
}