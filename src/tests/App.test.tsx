import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

describe('App', () => {
    it('renders the welcome message', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </AuthProvider>
        );
        expect(screen.getByText('DevBlog')).toBeInTheDocument();
    });
});
