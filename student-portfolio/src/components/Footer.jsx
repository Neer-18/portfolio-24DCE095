export default function Footer() {
    return (
        <footer style={{ textAlign: 'center', padding: '1.5rem', background: '#0f172a', color: '#94a3b8' }}>
            <p>&copy; {new Date().getFullYear()} Neer Patel. All Rights Reserved.</p>
        </footer>
    );
}