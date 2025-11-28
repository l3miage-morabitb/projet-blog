import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoginModal } from './components/auth/LoginModal';
import { useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { ArticleDetails } from './pages/ArticleDetails';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const handleWriteClick = () => {
    if (!isHomePage) {
      navigate('/');
      setShowForm(true);
    } else {
      setShowForm(!showForm);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1
            style={{ margin: 0, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            DevBlog
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: '#4b5563', fontWeight: 500 }}>
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleWriteClick}
                  style={{
                    padding: '0.5rem 1rem',
                    background: showForm && isHomePage ? '#ef4444' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {showForm && isHomePage ? 'Cancel' : 'Write Article'}
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
        <Routes>
          <Route path="/" element={<Home showForm={showForm} setShowForm={setShowForm} />} />
          <Route path="/article/:id" element={<ArticleDetails />} />
        </Routes>
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
