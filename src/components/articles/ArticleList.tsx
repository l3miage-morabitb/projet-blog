import React, { useEffect, useState } from 'react';
import type { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import { ArticleCard } from './ArticleCard';
import './ArticleList.css';

export const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await articleService.getAllArticles();
                setArticles(data);
            } catch (err) {
                setError('Failed to load articles. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className="loading-state">Loading amazing content...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    return (
        <div className="article-list-container">
            <h1 className="section-title">Latest Articles</h1>
            {articles.length === 0 ? (
                <div className="empty-state">No articles found. Be the first to write one!</div>
            ) : (
                <div className="article-grid">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
};
