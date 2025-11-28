export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
}

export type CreateArticleDTO = Omit<Article, 'id' | 'createdAt' | 'likes' | 'commentsCount'>;
