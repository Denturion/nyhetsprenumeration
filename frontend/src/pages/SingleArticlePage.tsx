import { useParams } from 'react-router';
import { useArticle } from '../hooks/useArticle';
import { useEffect, useState } from 'react';
import type { ArticleData } from '../models/ArticleOutput';

export const SingleArticlePage = () => {
	const { id } = useParams();
	const { getoneArticleById } = useArticle();

	const [article, setArticle] = useState<ArticleData>({
		id: 0,
		title: '',
		content: '',
		levelRequired: '',
		createdAt: '',
		image: '',
	});

	const subLevelDisplay: Record<string, string> = {
		free: 'Gratis',
		basic: 'Fiskepass',
		plus: 'Fiskeguide',
		full: 'Mästerfiskare',
	};

	useEffect(() => {
		if (!id) return;
		const fetchArticle = async () => {
			const oneArticle = await getoneArticleById(parseInt(id));
			setArticle(oneArticle);
		};
		fetchArticle();
	}, [id]);

	return (
		<div className='min-h-screen bg-gray-900 text-gray-100 p-6 max-w-4xl mx-auto'>
			<div className='bg-gray-800 shadow-md p-6 rounded-lg space-y-4'>
				{article.image && (
					<img
						src={article.image}
						alt={article.title}
						className='w-full h-64 object-cover rounded'
					/>
				)}

				<h1 className='text-3xl font-bold text-white'>{article.title}</h1>

				<div className='text-sm text-gray-400 flex justify-between'>
					<span>
						Åtkomstnivå:{' '}
						<span className='capitalize font-medium text-gray-200'>
							{subLevelDisplay[article.levelRequired]}
						</span>
					</span>
					<span>{new Date(article.createdAt).toLocaleDateString('sv-SE')}</span>
				</div>

				<p className='text-gray-200 whitespace-pre-line'>{article.content}</p>
				<a
					href='http://localhost:5173/dashboard'
					className=' text-blue-400 block mt-2'
				>
					Tillbaka till dashboard
				</a>
			</div>
		</div>
	);
};
