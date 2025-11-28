import { useState } from 'react';
import { ArticleList } from './components/articles/ArticleList';
import { ArticleForm } from './components/articles/ArticleForm';
import { LoginModal } from './components/auth/LoginModal';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Key to force re-render of list when new article is added
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();

  const handleArticleCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DevBlog
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: '#4b5563', fontWeight: 500 }}>
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={() => setShowForm(!showForm)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: showForm ? '#ef4444' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {showForm ? 'Cancel' : 'Write Article'}
                </button>
                <button
                  onClick={logout}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {showForm && isAuthenticated && (
          <div style={{ marginBottom: '3rem' }}>
            <ArticleForm onArticleCreated={handleArticleCreated} />
          </div>
        )}

        <ArticleList key={refreshKey} />
      </main>

      <footer className="app-footer">
        <p>© 2025 DevBlog. Built with React & TypeScript.</p>
      </footer>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default App;
