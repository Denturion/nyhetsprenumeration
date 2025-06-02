import type { ArticleData, Articlepagination, CreateArticleMesage, FormType, UpdateArticleMessage } from "../models/ArticleOutput";
import { deleteData, getData, patchData, postData } from "./baseservice";

const BASE_URL = "http://localhost:5000";

const handleRequest = async <T>(request: Promise<T>): Promise<T> => {
  try {
    return await request;
  } catch (error) {
    console.error("Något gick fel med API-anropet", error);
    throw new Error("API-anropet misslyckades");
  }
};


export const getAllArticles = async (page:number,query?:string):Promise<Articlepagination> => {
    return handleRequest(getData(`${BASE_URL}/articles?page=${page}&limit=8${query}`));
}

export const getArticleById = async (id:number):Promise<ArticleData> => {
    return handleRequest(getData(`${BASE_URL}/articles/${id}`));
}

export const updateArticleById = async (id:number,payload:FormType):Promise<UpdateArticleMessage> => {
    return handleRequest(patchData(`${BASE_URL}/articles/${id}`,payload));
}

export const deleteArticleById = async (id:number):Promise<string> => {
    return handleRequest(deleteData(`${BASE_URL}/articles/${id}`));
}
export const createArticle = async (payload:ArticleData):Promise<CreateArticleMesage> => {
    return handleRequest(postData(`${BASE_URL}/articles`, payload));
}