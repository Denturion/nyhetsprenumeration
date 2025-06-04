import { useParams } from "react-router";
import { useArticle } from "../hooks/useArticle";
import { useEffect, useState } from "react";
import type { ArticleData } from "../models/ArticleOutput";

export const SingleArticlePage = () => {
 const {id} = useParams()
 
 const { getoneArticleById } = useArticle()
 const [article, setArticle] = useState<ArticleData>({
	id: 0,
  title: "",
  content: "",
  levelRequired: "",
  createdAt: "",
  image:""
 })

 console.log(article.title);
 

 useEffect(() => {
	if (!id) return;
  const fetchArticle = async () => {
      const onearticle = await getoneArticleById(parseInt(id));  
      setArticle(onearticle);
	};
	fetchArticle();
}, [id]);


	return (
		<div className='flex flex-col items-center justify-center h-screen bg-slate-900'>
			<h1 className='text-4xl font-bold mb-4'>{article.title}</h1>
			<p className='text-lg'>This is a single article page.</p>
			<div className='bg-white p-6 rounded shadow-md w-80 mt-4'>
				<h2 className='text-2xl font-semibold mb-2'>Article Title</h2>
				<p className='text-gray-700 mb-4'>
					This is the content of the article. It contains detailed information
					and insights on the topic.
				</p>
				<button className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'>
					Read More
				</button>
			</div>
		</div>
	);
};
