import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../../types/article';
import { articleService } from '../../services/articleService';
import { useAuth } from '../../context/AuthContext';
import './ArticleCard.css';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [likes, setLikes] = useState(article.likes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLiked(article.likedBy.includes(user.id));
        } else {
            setIsLiked(false);
        }
        setLikes(article.likes);
    }, [article, user]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated || !user) {
            alert('Please login to like articles');
            return;
        }

        if (isLiking) return;

        setIsLiking(true);
        try {
            const updatedArticle = await articleService.likeArticle(article.id, user.id);
            if (updatedArticle) {
                setLikes(updatedArticle.likes);
                setIsLiked(updatedArticle.likedBy.includes(user.id));
            }
        } catch (err) {
            console.error('Failed to like article:', err);
        } finally {
            setIsLiking(false);
        }
    };

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
                    <button
                        onClick={handleLike}
                        className={`card-like-btn ${isLiked ? 'liked' : ''}`}
                        title={isLiked ? "Unlike this article" : "Like this article"}
                    >
                        {isLiked ? '❤️' : '🤍'} {likes}
                    </button>
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
