import type { ArticleData } from "../models/ArticleOutput";


export enum IArticle {
  GET_ARTICLES = "GET_ARTICLES",
  ADD_ARTICLE = "ADD_ARTICLE",
  REMOVE_ARTICLE = "REMOVE_ARTICLE",
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

    case IArticle.ADD_ARTICLE:
      if (Array.isArray(action.payload)) {
        throw new Error("Payload måste vara ett objekt för ADD_ARTICLE.");
      }
      return [...articles, action.payload as ArticleData];

      case IArticle.REMOVE_ARTICLE: {
        if (Array.isArray(action.payload)) {
          throw new Error("Payload måste vara ett objekt för REMOVE_ARTICLE.");
        }
        const removedArticle = action.payload as ArticleData;
        return articles.filter((article) => article.id !== removedArticle.id);
      }
      
      

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
