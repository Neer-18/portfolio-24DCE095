import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        try {
            if (isLoginMode) {
                const res = await loginUser({ email, password });
                onAuthSuccess(res.user, 'Logged in successfully!');
                onClose();
            } else {
                await registerUser({ name, email, password });
                // Auto-login after registration
                const res = await loginUser({ email, password });
                onAuthSuccess(res.user, 'Account created and logged in!');
                onClose();
            }
        } catch (err) {
            setFormError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (mode) => {
        setIsLoginMode(mode);
        setFormError(null);
    };

    return (
        <div className="modal-backdrop" onClick={onClose} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
        }}>
            <div
                className="modal-box glassmorphic"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    width: '100%',
                    maxWidth: '440px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            >
                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(15, 23, 42, 0.6)'
                }}>
                    <button
                        type="button"
                        onClick={() => switchMode(true)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            background: isLoginMode ? '#1e293b' : 'transparent',
                            color: isLoginMode ? '#60a5fa' : '#94a3b8',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            borderBottom: isLoginMode ? '2px solid #3b82f6' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        🔐 Log In
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode(false)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            background: !isLoginMode ? '#1e293b' : 'transparent',
                            color: !isLoginMode ? '#60a5fa' : '#94a3b8',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            borderBottom: !isLoginMode ? '2px solid #3b82f6' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        ✨ Create Account
                    </button>
                </div>

                {/* Form Body */}
                <div style={{ padding: '1.75rem' }}>
                    <h2 style={{
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        marginBottom: '0.5rem'
                    }}>
                        {isLoginMode ? 'Welcome Back!' : 'Register New Account'}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                        {isLoginMode
                            ? 'Sign in to access and manage your protected tasks.'
                            : 'Sign up to create your own secure, JWT-authenticated task list.'}
                    </p>

                    {formError && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#fca5a5',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            marginBottom: '1.25rem'
                        }}>
                            ⚠️ {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!isLoginMode && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Neer Patel"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 0.85rem',
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: '#f8fafc',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    backgroundColor: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#f8fafc',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                                Password {isLoginMode ? '' : '(min. 6 characters)'}
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    backgroundColor: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#f8fafc',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: '0.65rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#94a3b8',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 2,
                                    padding: '0.65rem',
                                    backgroundColor: '#3b82f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
