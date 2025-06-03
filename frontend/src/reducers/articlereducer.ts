import type { ArticleData } from "../models/ArticleOutput";


export enum IArticle {
  GET_ARTICLES = "GET_ARTICLES",
  UPDATE_ARTICLE = "UPDATE_ARTICLE",
}

interface IactionArticle {
  type: IArticle;
  payload: ArticleData | ArticleData[];
}

export const ArticleReducer = (articles: ArticleData[] = [], action: IactionArticle): ArticleData[] => {
  switch (action.type) {
    case IArticle.GET_ARTICLES:
      if (!Array.isArray(action.payload)) {
        throw new Error("Payload måste vara en array för GET_ARTICLES.");
      }
      return action.payload;

      case IArticle.UPDATE_ARTICLE: {
        if (Array.isArray(action.payload)) {
          throw new Error("Payload måste vara ett objekt för UPDATE_ARTICLE.");
        }
        const updatedArticle = action.payload as ArticleData;
        return articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        );
      }
      
    default:
      return articles;
  }
};
