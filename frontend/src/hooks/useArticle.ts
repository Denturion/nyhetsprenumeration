import { useEffect, useReducer, useState } from 'react';
import { ArticleReducer, IArticle } from '../reducers/articlereducer';
import {
	createArticle,
	deleteArticleById,
	getAllArticles,
	getArticleById,
	updateArticleById,
} from '../services/articleservice';
import type { ArticleData, FormType } from '../models/ArticleOutput';

export const useArticle = () => {
	const [articles, Dispatch] = useReducer(ArticleReducer, []);
	const [lockedArticles, setLockedArticles] = useState<ArticleData[]>([]);
	const [isloading, setIsloading] = useState<boolean>(false);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		/* const token = sessionStorage.getItem("token");
  		if (!token) return; */ 
		setIsloading(true);
		getallArticles(1);
	}, []);

	const getallArticles = async (
		pageNumber: number,
		level?: string,
		search?: string
	) => {
		try {
			const { totalPages, items, locked } = await getAllArticles(
				pageNumber,
				level,
				search
			);
			setTotalPages(totalPages);
			Dispatch({
				type: IArticle.GET_ARTICLES,
				payload: items,
			});
			setLockedArticles(locked || []);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Fel vid hämtning av artiklar:', error.message);
			} else {
				console.error('Okänt fel vid hämtning av artiklar:', error);
			}
		} finally {
			setIsloading(false);
		}
	};

	const getoneArticleById = async (id: number) => {
		const article = await getArticleById(id);
		return article;
	};

	const createNewArticle = async (formData: FormType) => {
		await createArticle(formData as ArticleData);
		await getallArticles(1);
	};

	const UpdateArticle = async (UpdateId: number, formData: FormType) => {
		const { article } = await updateArticleById(UpdateId, formData);
		Dispatch({
			type: IArticle.UPDATE_ARTICLE,
			payload: article,
		});
	};

	const DeleteArticle = async (id: number) => {
		await deleteArticleById(id);
		await getallArticles(1);
	};

	return {
		articles,
		lockedArticles,
		isloading,
		totalPages,
		Dispatch,
		createNewArticle,
		UpdateArticle,
		DeleteArticle,
		getallArticles,
		getoneArticleById,
	};
};
