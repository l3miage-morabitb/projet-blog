import type { User, LoginCredentials } from '../types/auth';

const AUTH_KEY = 'blog_auth_user';
const USERS_KEY = 'blog_registered_users';

interface StoredUser extends User {
    password?: string; // In a real app, this would be hashed!
}

class AuthService {
    async login(credentials: LoginCredentials & { password?: string }): Promise<User> {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const usersJson = localStorage.getItem(USERS_KEY);
                const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

                // For now, if no password provided (legacy/mock), we might just allow it or fail.
                // But the plan said "Real Login". So we expect a password.
                // However, the LoginCredentials interface in types/auth.ts only has username.
                // I should probably update the type or just cast here for the mock.
                // Let's assume we want to enforce password check if the user exists.

                const user = users.find(u => u.username === credentials.username);

                if (user) {
                    // Check password if we had one stored (mocking simple check)
                    // Since we are adding registration now, we should require password matching.
                    // But for the "mock" nature, if the user doesn't exist, maybe we still allow it?
                    // No, the plan said "Login will now verify against these stored users".
                    // So if user not found, login fails.

                    if (user.password === credentials.password) {
                        const { password, ...userWithoutPassword } = user;
                        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
                        resolve(userWithoutPassword);
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                } else {
                    // For backward compatibility or ease of testing, maybe we still allow "admin" if not registered?
                    // No, let's be strict as per plan.
                    reject(new Error('User not found'));
                }
            }, 500);
        });
    }

    async register(credentials: LoginCredentials & { password?: string }): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const usersJson = localStorage.getItem(USERS_KEY);
                const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

                if (users.some(u => u.username === credentials.username)) {
                    reject(new Error('Username already exists'));
                    return;
                }

                const newUser: StoredUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    username: credentials.username,
                    name: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
                    avatar: `https://ui-avatars.com/api/?name=${credentials.username}&background=random`,
                    password: credentials.password
                };

                users.push(newUser);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));

                // Auto login after register
                const { password, ...userWithoutPassword } = newUser;
                localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

                resolve(userWithoutPassword);
            }, 500);
        });
    }

    logout(): void {
        localStorage.removeItem(AUTH_KEY);
    }

    getCurrentUser(): User | null {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse auth user', e);
                return null;
            }
        }
        return null;
    }
}

export const authService = new AuthService();
