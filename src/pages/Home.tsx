import React, { useState } from 'react';
import { ArticleList } from '../components/articles/ArticleList';
import { ArticleForm } from '../components/articles/ArticleForm';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
    showForm: boolean;
    setShowForm: (show: boolean) => void;
}

export const Home: React.FC<HomeProps> = ({ showForm, setShowForm }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { isAuthenticated } = useAuth();

    const handleArticleCreated = () => {
        setShowForm(false);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <>
            {showForm && isAuthenticated && (
                <div style={{ marginBottom: '3rem' }}>
                    <ArticleForm onArticleCreated={handleArticleCreated} />
                </div>
            )}
            <ArticleList key={refreshKey} />
        </>
    );
};
