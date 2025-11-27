import type { Article, CreateArticleDTO } from '../types/article';

// Mock data for initial testing
const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'The Future of Web Development',
        content: 'Full content about web development trends...',
        author: 'Jane Doe',
        createdAt: new Date().toISOString(),
        likes: 12,
        commentsCount: 3,
    },
    {
        id: '2',
        title: 'Understanding TypeScript Generics',
        content: 'Full content about generics...',
        author: 'John Smith',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        likes: 45,
        commentsCount: 8,
    },
];

class ArticleService {
    private articles: Article[] = [...MOCK_ARTICLES];

    async getAllArticles(): Promise<Article[]> {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => resolve([...this.articles]), 500);
        });
    }

    async getArticleById(id: string): Promise<Article | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.articles.find((a) => a.id === id)), 300);
        });
    }

    async searchArticles(query: string): Promise<Article[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lowerQuery = query.toLowerCase();
                const filtered = this.articles.filter((article) =>
                    article.title.toLowerCase().includes(lowerQuery) ||
                    article.content.toLowerCase().includes(lowerQuery) ||
                    article.author.toLowerCase().includes(lowerQuery)
                );
                resolve(filtered);
            }, 400);
        });
    }

    async createArticle(data: CreateArticleDTO): Promise<Article> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newArticle: Article = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    commentsCount: 0,
                };
                this.articles = [newArticle, ...this.articles];
                resolve(newArticle);
            }, 600);
        });
    }
}

export const articleService = new ArticleService();
