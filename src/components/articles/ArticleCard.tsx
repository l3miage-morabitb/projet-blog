import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../../types/article';
import './ArticleCard.css';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const navigate = useNavigate();

    return (
        <article className="article-card">
            <header>
                <div className="article-header">
                    <h2 className="article-title">{article.title}</h2>
                </div>
                <div className="article-meta">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <time dateTime={article.createdAt}>
                        {new Date(article.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </div>
            </header>

            <div className="article-excerpt">
                <p>{article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}</p>
            </div>

            <footer className="article-footer">
                <div className="article-stats">
                    <span>❤️ {article.likes}</span>
                    <span>💬 {article.commentsCount}</span>
                </div>
                <button
                    className="read-more-btn"
                    onClick={() => navigate(`/article/${article.id}`)}
                >
                    Read Article
                </button>
            </footer>
        </article>
    );
};
