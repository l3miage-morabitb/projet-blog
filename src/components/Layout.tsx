import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Mon Blog</h1>
                <nav>
                    {/* Navigation links will go here */}
                </nav>
            </header>
            <main className="app-main">
                {children}
            </main>
            <footer className="app-footer">
                <p>&copy; 2024 Mon Blog. Tous droits réservés.</p>
            </footer>
        </div>
    );
};
