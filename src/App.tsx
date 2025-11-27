import { useState } from 'react';
import { ArticleList } from './components/articles/ArticleList';
import { ArticleForm } from './components/articles/ArticleForm';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  // Key to force re-render of list when new article is added
  const [refreshKey, setRefreshKey] = useState(0);

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
        </div>
      </header>

      <main className="app-main">
        {showForm && (
          <div style={{ marginBottom: '3rem' }}>
            <ArticleForm onArticleCreated={handleArticleCreated} />
          </div>
        )}

        <ArticleList key={refreshKey} />
      </main>

      <footer className="app-footer">
        <p>© 2025 DevBlog. Built with React & TypeScript.</p>
      </footer>
    </div>
  );
}

export default App;
