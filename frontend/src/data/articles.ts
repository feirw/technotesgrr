/**
 * Τύποι για /articles. Τα άρθρα φορτώνονται από το API (`GET /api/articles`).
 */

export type ArticlePastel = 'white' | 'sky' | 'pink' | 'yellow' | 'violet' | 'mint';

export interface Article {
  id: number;
  authorName: string;
  authorAvatar?: string;
  publishedAt: string;
  title: string;
  body: string;
  pastel: ArticlePastel;
  likes: number;
}
