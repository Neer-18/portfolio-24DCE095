import { useState } from 'react';

export default function Contact() {
    const [message, setMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <section style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Contact Me</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Your Message:
                    <button
                        type="button"
                        onClick={() => setShowTooltip(!showTooltip)}
                        style={{ marginLeft: '10px', cursor: 'pointer', borderRadius: '50%', padding: '0 8px' }}
                        title="Toggle Help"
                    >
                        ?
                    </button>
                </label>

                {showTooltip && (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0' }}>
                        Type your message below. The state updates in real-time without page reloads.
                    </p>
                )}

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    style={{ width: '100%', padding: '0.5rem', fontFamily: 'inherit' }}
                    placeholder="Hello Neer..."
                />
            </div>

            <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '4px', color: '#000' }}>
                <strong>Live Preview:</strong>
                <p>{message || "Start typing to see your message here..."}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Character count: {message.length}
                </p>
            </div>
        </section>
    );
}