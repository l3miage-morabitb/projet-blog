import type { Article, CreateArticleDTO } from '../types/article';

// Mock des articles pour presentation
const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Le futur de la web',
        content: "La créativité gabonaise en action, même à Grenoble ! \nLe robot de Tristan : 100% fait maison, 100% talent, 100% inspiration",
        author: "Centre gabonais de l'innovation",
        createdAt: new Date().toISOString(),
        likes: 12,
        commentsCount: 3,
    },
    {
        id: '2',
        title: 'Alternance....',
        content: 'Recherche d’alternance : j’en ai MARRE. Vraiment.',
        author: 'Enis Mermer',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 45,
        commentsCount: 8,
    },
];

// Service pour gérer les articles
class ArticleService {
    private articles: Article[] = [...MOCK_ARTICLES];

    // Récupère tous les articles
    async getAllArticles(): Promise<Article[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...this.articles]), 500);
        });
    }

    // Récupère un article par son ID
    async getArticleById(id: string): Promise<Article | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.articles.find((a) => a.id === id)), 300);
        });
    }

    // Recherche des articles par titre, contenu ou auteur
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

    // Créer un nouvel article
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

// Instance du service
export const articleService = new ArticleService();
