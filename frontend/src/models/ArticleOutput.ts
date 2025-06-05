
export interface Articlepagination {
  page: number;
  totalPages: number;
  totalItems: number;
  items: ArticleData[];
}

export interface ArticleData {
  id: number;
  title: string;
  content: string;
  levelRequired: string;
  createdAt: string;
  image?:string
}

export type FormType = Pick<ArticleData, "title" | "content" | "levelRequired" | "image">;

export interface CreateArticleMesage {
  message: string;
  id: number;
  created:string;
}

export interface UpdateArticleMessage {
  message: string;
  article: ArticleData;
}

