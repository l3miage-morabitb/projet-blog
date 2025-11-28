import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import type { Article, Comment } from '../types/article';
import { useAuth } from '../context/AuthContext';
import './ArticleDetails.css';

export const ArticleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [article, setArticle] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [articleData, commentsData] = await Promise.all([
                    articleService.getArticleById(id),
                    articleService.getComments(id)
                ]);

                if (articleData) {
                    setArticle(articleData);
                    setComments(commentsData);
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

        fetchData();
    }, [id]);

    const handleLike = async () => {
        if (!article || !id) return;

        if (!isAuthenticated || !user) {
            alert('Please login to like articles');
            return;
        }

        // Optimistic update
        const wasLiked = article.likedBy.includes(user.id);
        const newLikes = wasLiked ? article.likes - 1 : article.likes + 1;
        const newLikedBy = wasLiked
            ? article.likedBy.filter(uid => uid !== user.id)
            : [...article.likedBy, user.id];

        setArticle({
            ...article,
            likes: newLikes,
            likedBy: newLikedBy
        });

        try {
            const updatedArticle = await articleService.likeArticle(id, user.id);
            if (updatedArticle) {
                // Confirm with server state
                setArticle({ ...updatedArticle });
            } else {
                // Revert if failed (or article not found)
                setArticle({
                    ...article,
                    likes: article.likes,
                    likedBy: article.likedBy
                });
            }
        } catch (err) {
            console.error('Failed to like article:', err);
            // Revert on error
            setArticle({
                ...article,
                likes: article.likes,
                likedBy: article.likedBy
            });
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newComment.trim() || !user) return;

        setSubmittingComment(true);
        try {
            const comment = await articleService.addComment({
                articleId: id,
                content: newComment,
                author: user.name,
            });
            setComments(prev => [comment, ...prev]);
            setNewComment('');

            // Update local article comment count
            if (article) {
                setArticle({
                    ...article,
                    commentsCount: article.commentsCount + 1
                });
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
            alert('Failed to post comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

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
                    <button
                        onClick={handleLike}
                        className={`like-btn ${user && article.likedBy.includes(user.id) ? 'liked' : ''}`}
                    >
                        {user && article.likedBy.includes(user.id) ? '❤️' : '🤍'} {article.likes} Likes
                    </button>
                    <span>💬 {article.commentsCount} Comments</span>
                </div>
            </footer>

            <section className="comments-section">
                <h3>Comments</h3>

                {isAuthenticated ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            required
                            className="comment-input"
                        />
                        <button
                            type="submit"
                            disabled={submittingComment || !newComment.trim()}
                            className="submit-comment-btn"
                        >
                            {submittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                ) : (
                    <div className="login-prompt">
                        Please login to leave a comment.
                    </div>
                )}

                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-card">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.author}</span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </article>
    );
};
