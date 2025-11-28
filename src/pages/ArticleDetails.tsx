import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import type { Article } from '../types/article';
import './ArticleDetails.css';

export const ArticleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const data = await articleService.getArticleById(id);
                if (data) {
                    setArticle(data);
                } else {
                    setError('Article not found');
                }
            } catch (err) {
                setError('Failed to load article');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) return <div className="loading-state">Loading article...</div>;
    if (error || !article) return <div className="error-state">{error || 'Article not found'}</div>;

    return (
        <article className="article-details-container">
            <button onClick={() => navigate('/')} className="back-btn">
                ← Back to Articles
            </button>

            <header className="article-details-header">
                <h1 className="article-details-title">{article.title}</h1>
                <div className="article-details-meta">
                    <span className="author">By {article.author}</span>
                    <span className="separator">•</span>
                    <time dateTime={article.createdAt}>
                        {new Date(article.createdAt).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
            </header>

            <div className="article-details-content">
                {article.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <footer className="article-details-footer">
                <div className="stats">
                    <span>❤️ {article.likes} Likes</span>
                    <span>💬 {article.commentsCount} Comments</span>
                </div>
            </footer>
        </article>
    );
};
