import type { User, LoginCredentials } from '../types/auth';

const AUTH_KEY = 'test';
const USERS_KEY = 'test';

// Interface pour représenter un utilisateur stocké
interface StoredUser extends User {
    password?: string;
}

// Service pour gérer l'authentification
class AuthService {

    // Authentification
    async login(credentials: LoginCredentials & { password?: string }): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Récupération des utilisateurs stockés
                const usersJson = localStorage.getItem(USERS_KEY);
                const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

                // Recherche de l'utilisateur
                const user = users.find(u => u.username === credentials.username);

                // Vérification des identifiants
                if (user) {
                    if (user.password === credentials.password) {
                        const { password, ...userWithoutPassword } = user;
                        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
                        resolve(userWithoutPassword);
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                } else {
                    reject(new Error('User not found'));
                }
            }, 500);
        });
    }

    // Inscription
    async register(credentials: LoginCredentials & { password?: string }): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Récupération des utilisateurs stockés
                const usersJson = localStorage.getItem(USERS_KEY);
                const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

                // Vérification de l'unicité du nom d'utilisateur
                if (users.some(u => u.username === credentials.username)) {
                    reject(new Error('Username already exists'));
                    return;
                }

                // Création de l'utilisateur
                const newUser: StoredUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    username: credentials.username,
                    name: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
                    avatar: `https://ui-avatars.com/api/?name=${credentials.username}&background=random`,
                    password: credentials.password
                };

                users.push(newUser);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));

                // auto login apres inscription
                const { password, ...userWithoutPassword } = newUser;
                localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));

                resolve(userWithoutPassword);
            }, 500);
        });
    }

    logout(): void {
        localStorage.removeItem(AUTH_KEY);
    }

    // Recupere l'utilisateur connecte
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
