import { Link } from 'react-router-dom';
import type { ArticleData } from '../models/ArticleOutput';

interface ArticleListProps {
	articles: ArticleData[];
	onUpdate?: (article: ArticleData) => void;
	onDelete?: (id: number) => void;
}

export const ArticleList = ({
	articles,
	onUpdate,
	onDelete,
}: ArticleListProps) => {
	const levelNames: Record<string, string> = {
		basic: 'Fiskepass',
		plus: 'Fiskeguide',
		full: 'Mästerfiskare',
	};

	return (
		<ul className='space-y-2'>
			{articles.map((article) => (
				<li
					key={article.id}
					className='border-b border-gray-700 py-3 px-4 bg-gray-800 rounded text-white'
				>
					<div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
						<div>
							<Link
								to={`/article/${article.id}`}
								className='text-blue-400 hover:underline font-semibold'
							>
								<strong>{article.title}</strong>
							</Link>{' '}
							– nivå:{' '}
							<span className='text-gray-300'>
								{levelNames[article.levelRequired]}
							</span>
						</div>
						{(onUpdate || onDelete) && (
							<div className='flex gap-2'>
								{onUpdate && (
									<button
										onClick={() => onUpdate(article)}
										className='ml-auto bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm'
									>
										Redigera
									</button>
								)}
								{onDelete && (
									<button
										onClick={() => onDelete(article.id)}
										className='bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm'
									>
										Ta bort
									</button>
								)}
							</div>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};
