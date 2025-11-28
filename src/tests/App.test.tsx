import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

import { AuthProvider } from '../context/AuthContext';

describe('App', () => {
    it('renders the welcome message', () => {
        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );
        expect(screen.getByText('DevBlog')).toBeInTheDocument();
    });
});
