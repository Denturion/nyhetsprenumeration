import type {
	ArticleData,
	Articlepagination,
	CreateArticleMesage,
	FormType,
	UpdateArticleMessage,
} from '../models/ArticleOutput';
import { deleteData, getData, patchData, postData } from './baseservice';

const handleRequest = async <T>(request: Promise<T>): Promise<T> => {
	try {
		return await request;
	} catch (error) {
		console.error('Något gick fel med API-anropet', error);
		throw new Error('API-anropet misslyckades');
	}
};

export const getAllArticles = async (
	page: number,
	query?: string,
	searchquery?: string
): Promise<Articlepagination> => {
	let url = `/articles?page=${page}&limit=8`;

	if (query) {
		url += `&level=${query}`;
	}
	if (searchquery) {
		url += `&search=${searchquery}`;
	}
	return handleRequest(getData(url));
};

export const getArticleById = async (id: number): Promise<ArticleData> => {
	return handleRequest(getData(`/articles/${id}`));
};

export const updateArticleById = async (
	id: number,
	payload: FormType
): Promise<UpdateArticleMessage> => {
	return handleRequest(patchData(`/articles/${id}`, payload));
};

export const deleteArticleById = async (id: number): Promise<string> => {
	return handleRequest(deleteData(`/articles/${id}`));
};
export const createArticle = async (
	payload: ArticleData
): Promise<CreateArticleMesage> => {
	return handleRequest(postData(`/articles`, payload));
};
