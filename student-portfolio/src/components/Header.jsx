export default function Header({ name, themeColor = '#2563eb' }) {
    return (
        <header style={{ backgroundColor: themeColor, color: '#fff', padding: '1.5rem', textAlign: 'center' }}>
            <h1>{name}</h1>
        </header>
    );
}