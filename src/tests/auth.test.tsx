/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { authService } from '../services/authService';

// Mock the auth service
vi.mock('../services/authService', () => ({
    authService: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
    },
}));

describe('Authentication Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authService.getCurrentUser as any).mockReturnValue(null);
    });

    it('shows login button when not authenticated', () => {
        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('opens login modal when login button is clicked', () => {
        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('logs in successfully and updates UI', async () => {
        const mockUser = { id: '1', username: 'testuser', name: 'TestUser' };
        (authService.login as any).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        // Open modal
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password' } });

        // Submit
        const buttons = screen.getAllByRole('button', { name: 'Login' });
        const modalButton = buttons[buttons.length - 1];
        fireEvent.click(modalButton);

        // Wait for login to complete
        await waitFor(() => {
            expect(screen.getByText('Welcome, TestUser')).toBeInTheDocument();
        });
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    });

    it('logs out successfully', async () => {
        // Start as logged in
        const mockUser = { id: '1', username: 'testuser', name: 'TestUser' };
        (authService.getCurrentUser as any).mockReturnValue(mockUser);

        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        expect(screen.getByText('Welcome, TestUser')).toBeInTheDocument();

        // Click logout
        fireEvent.click(screen.getByText('Logout'));

        expect(authService.logout).toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        expect(screen.queryByText('Welcome, TestUser')).not.toBeInTheDocument();
    });

    it('switches to register mode and registers successfully', async () => {
        const mockUser = { id: '2', username: 'newuser', name: 'NewUser' };
        (authService.register as any).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        // Open modal
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        // Switch to register
        fireEvent.click(screen.getByText('Register')); // The toggle button text

        // Check header changed
        expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(screen.getByText('Welcome, NewUser')).toBeInTheDocument();
        });
    });
});
