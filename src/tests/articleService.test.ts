import { describe, it, expect } from 'vitest';
import { articleService } from '../services/articleService';

// Mock des articles pour presentation
describe('ArticleService', () => {
    it('should fetch initial articles', async () => {
        const articles = await articleService.getAllArticles();
        expect(articles.length).toBeGreaterThan(0);
        expect(articles[0]).toHaveProperty('id');
        expect(articles[0]).toHaveProperty('title');
    });

    it('should create a new article', async () => {
        const newArticleData = {
            title: 'Test Article',
            content: 'Test Content',
            author: 'Tester',
        };

        const createdArticle = await articleService.createArticle(newArticleData);

        expect(createdArticle).toMatchObject(newArticleData);
        expect(createdArticle.id).toBeDefined();
        expect(createdArticle.createdAt).toBeDefined();
        expect(createdArticle.likes).toBe(0);

        const allArticles = await articleService.getAllArticles();
        expect(allArticles).toContainEqual(createdArticle);
    });

    it('should search articles', async () => {
        const results = await articleService.searchArticles('Futur');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toMatch(/Futur/i);

        const noResults = await articleService.searchArticles('NonExistentTerm');
        expect(noResults.length).toBe(0);
    });
});
