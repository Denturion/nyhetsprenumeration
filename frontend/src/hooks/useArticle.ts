import { useEffect, useReducer, useState } from "react";
import { ArticleReducer, IArticle } from "../reducers/articlereducer";
import { createArticle, getAllArticles } from "../services/articleservice";
import type { ArticleData, FormType } from "../models/ArticleOutput";

export const useArticle = () => {
  const [articles, Dispatch] = useReducer(ArticleReducer, []);
  const [isloading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    setIsloading(true);
    getallArticles();
  }, []);

  const getallArticles = async () => {
    try {
      const articles = await getAllArticles();
      Dispatch({
        type: IArticle.GET_ARTICLES,
        payload: articles,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Fel vid hämtning av artiklar:", error.message);
      } else {
        console.error("Okänt fel vid hämtning av artiklar:", error);
      }
    } finally {
      setIsloading(false);
    }
  };

  const createNewArticle = async (formData: FormType) => {
    const { id, created } = await createArticle(formData as ArticleData);
    console.log(id);
    const newArticle: ArticleData = {
      id: id,
      title: formData.title,
      content: formData.content,
      levelRequired: formData.levelRequired,
      createdAt: created,
    };
    Dispatch({
      type: IArticle.ADD_ARTICLE,
      payload: newArticle,
    });
  };

  return { articles, isloading, Dispatch, createNewArticle };
};
