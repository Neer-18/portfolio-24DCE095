import { useState } from 'react';

export default function Contact() {
    const [message, setMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Simulate sending a message
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h2>Contact Me</h2>
                <div style={{
                    padding: '2.5rem 1.5rem',
                    background: 'var(--accent-bg)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow)',
                    marginTop: '2rem',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }} role="img" aria-label="success">
                        ✉️
                    </span>
                    <h3 style={{ color: 'var(--text-h)', margin: '0 0 0.5rem', fontSize: '1.5rem' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>
                        Thank you for reaching out. Neer will get back to you soon.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setMessage('');
                        }}
                        className="btn-primary"
                        style={{ cursor: 'pointer' }}
                    >
                        Send Another Message
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Contact Me</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--text-h)' }}>
                        Your Message:
                        <button
                            type="button"
                            onClick={() => setShowTooltip(!showTooltip)}
                            style={{
                                cursor: 'pointer',
                                borderRadius: '50%',
                                padding: '2px 8px',
                                border: '1px solid var(--border)',
                                background: 'var(--code-bg)',
                                color: 'var(--text-h)',
                                fontSize: '0.85rem'
                            }}
                            title="Toggle Help"
                        >
                            ?
                        </button>
                    </label>

                    {showTooltip && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '0' }}>
                            Type your message below. The state updates in real-time without page reloads.
                        </p>
                    )}

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="input-field"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            borderRadius: '8px'
                        }}
                        placeholder="Hello Neer..."
                        required
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={!message.trim()}
                        style={{
                            opacity: message.trim() ? 1 : 0.6,
                            cursor: message.trim() ? 'pointer' : 'not-allowed',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            borderRadius: '8px'
                        }}
                    >
                        Send Message
                    </button>
                </div>
            </form>

            <div style={{
                padding: '1.25rem',
                background: 'var(--accent-bg)',
                border: '1px solid var(--accent-border)',
                borderRadius: '8px',
                color: 'var(--text-h)',
                textAlign: 'left'
            }}>
                <strong style={{ color: 'var(--text-h)', display: 'block', marginBottom: '0.5rem' }}>Live Preview:</strong>
                <p style={{
                    color: message ? 'var(--text-h)' : 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: '0 0 1rem 0',
                    fontStyle: message ? 'normal' : 'italic'
                }}>
                    {message || "Start typing to see your message here..."}
                </p>
                <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text)',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>Character count: {message.length}</span>
                    <span>Words: {message.trim() ? message.trim().split(/\s+/).length : 0}</span>
                </div>
            </div>
        </section>
    );
}