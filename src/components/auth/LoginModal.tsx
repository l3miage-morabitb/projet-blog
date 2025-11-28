import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, register, isLoading } = useAuth();
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            if (isLoginMode) {
                await login({ username, password });
            } else {
                await register({ username, password });
            }
            onClose();
            setUsername('');
            setPassword('');
            setIsLoginMode(true); // Reset to login mode
        } catch (err: any) {
            console.error(err);
            setError(err.message || (isLoginMode ? 'Login failed' : 'Registration failed'));
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#3b82f6',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                padding: 0,
                                font: 'inherit'
                            }}
                        >
                            {isLoginMode ? 'Register' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
