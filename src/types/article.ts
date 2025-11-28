export interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked the article
  commentsCount: number;
}

export type CreateArticleDTO = Omit<Article, 'id' | 'createdAt' | 'likes' | 'commentsCount' | 'likedBy'>;
export type CreateCommentDTO = Omit<Comment, 'id' | 'createdAt'>;
