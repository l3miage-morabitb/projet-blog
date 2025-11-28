import React, { useState, useCallback } from 'react';
import type { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import { ArticleCard } from './ArticleCard';
import { SearchBar } from './SearchBar';
import './ArticleList.css';

export const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = query.trim()
                ? await articleService.searchArticles(query)
                : await articleService.getAllArticles();
            setArticles(data);
        } catch (err) {
            setError('Failed to load articles. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="article-list-container">
            <h1 className="section-title">Latest Articles</h1>
            <SearchBar onSearch={handleSearch} />

            {loading ? (
                <div className="loading-state">Loading amazing content...</div>
            ) : error ? (
                <div className="error-state">{error}</div>
            ) : articles.length === 0 ? (
                <div className="empty-state">No articles found matching your search.</div>
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
