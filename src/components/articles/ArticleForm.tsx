import React, { useState } from 'react';
import type { CreateArticleDTO } from '../../types/article';
import { articleService } from '../../services/articleService';
import './ArticleForm.css';

interface ArticleFormProps {
    onArticleCreated?: () => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ onArticleCreated }) => {
    const [formData, setFormData] = useState<CreateArticleDTO>({
        title: '',
        content: '',
        author: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await articleService.createArticle(formData);
            setFormData({
                title: '',
                content: '',
                author: '',
            });
            if (onArticleCreated) {
                onArticleCreated();
            }
            alert('Article published successfully!');
        } catch (error) {
            console.error('Failed to create article:', error);
            alert('Failed to create article.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="article-form-card">
            <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Write a New Article</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="title">Title</label>
                    <input
                        id="title"
                        name="title"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter a catchy title..."
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="author">Author Name</label>
                    <input
                        id="author"
                        name="author"
                        className="form-input"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        placeholder="Who is writing this?"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        className="form-textarea"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        placeholder="Start writing your masterpiece..."
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing...' : 'Publish Article'}
                </button>
            </form>
        </div>
    );
};
