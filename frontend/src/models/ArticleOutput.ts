export interface ArticleData {
  id: number;
  title: string;
  content: string;
  levelRequired: string;
  createdAt: string;
}

export interface CreateArticleMesage {
  message: string;
  id: number;
}

export interface UpdateArticleMessage {
  message: string;
  article: ArticleData;
}

