import type { Article, CreateArticleDTO, Comment, CreateCommentDTO } from '../types/article';

// Mock data for initial testing
const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Le futur de la web',
        content: "La créativité gabonaise en action, même à Grenoble ! \nLe robot de Tristan : 100% fait maison, 100% talent, 100% inspiration",
        author: "Centre gabonais de l'innovation",
        createdAt: new Date().toISOString(),
        likes: 12,
        likedBy: [],
        commentsCount: 3,
    },
    {
        id: '2',
        title: 'Alternance....',
        content: 'Recherche d’alternance : j’en ai MARRE. Vraiment.',
        author: 'Enis Mermer',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        likes: 45,
        likedBy: [],
        commentsCount: 8,
    },
];

class ArticleService {
    private articles: Article[] = [...MOCK_ARTICLES];
    private comments: Comment[] = [];

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
                    likedBy: [],
                    commentsCount: 0,
                };
                this.articles = [newArticle, ...this.articles];
                resolve(newArticle);
            }, 600);
        });
    }

    async likeArticle(id: string, userId: string): Promise<Article | undefined> {
        console.log('Service: likeArticle called for id:', id, 'user:', userId);
        return new Promise((resolve) => {
            setTimeout(() => {
                const articleIndex = this.articles.findIndex((a) => a.id === id);
                console.log('Service: article index found:', articleIndex);
                if (articleIndex !== -1) {
                    const article = this.articles[articleIndex];
                    const hasLiked = article.likedBy.includes(userId);

                    let updatedLikes = article.likes;
                    let updatedLikedBy = [...article.likedBy];

                    if (hasLiked) {
                        // Dislike
                        updatedLikes--;
                        updatedLikedBy = updatedLikedBy.filter(uid => uid !== userId);
                    } else {
                        // Like
                        updatedLikes++;
                        updatedLikedBy.push(userId);
                    }

                    const updatedArticle = {
                        ...article,
                        likes: updatedLikes,
                        likedBy: updatedLikedBy
                    };
                    this.articles[articleIndex] = updatedArticle;
                    console.log('Service: article updated:', updatedArticle);
                    resolve(updatedArticle);
                } else {
                    console.log('Service: article not found');
                    resolve(undefined);
                }
            }, 200);
        });
    }

    async getComments(articleId: string): Promise<Comment[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.comments.filter(c => c.articleId === articleId).sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ));
            }, 300);
        });
    }

    async addComment(data: CreateCommentDTO): Promise<Comment> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newComment: Comment = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    createdAt: new Date().toISOString(),
                };
                this.comments.push(newComment);

                // Update article comment count
                const articleIndex = this.articles.findIndex(a => a.id === data.articleId);
                if (articleIndex !== -1) {
                    this.articles[articleIndex] = {
                        ...this.articles[articleIndex],
                        commentsCount: this.articles[articleIndex].commentsCount + 1
                    };
                }

                resolve(newComment);
            }, 400);
        });
    }
}

export const articleService = new ArticleService();
