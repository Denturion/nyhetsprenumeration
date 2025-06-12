import { useNavigate } from 'react-router-dom';
import { ArticleList } from './ArticleList';
import type { ArticleData } from '../models/ArticleOutput';

interface DashboardArticlesProps {
	articles: ArticleData[];
	lockedArticles: ArticleData[];
	userLevel: string;
	isLoading: boolean;
	searchQuery: string;
	setSearchQuery: (s: string) => void;
	showAccessibleOnly: boolean;
}

const levelNames: Record<string, string> = {
	basic: 'Fiskepass',
	plus: 'Fiskeguide',
	full: 'Mästerfiskare',
	free: 'Gratis',
};

const levelOrder = ['free', 'basic', 'plus', 'full'];

export const DashboardArticles = ({
	articles,
	lockedArticles,
	userLevel,
	isLoading,
	searchQuery,
}: DashboardArticlesProps) => {
	const navigate = useNavigate();
	const userLevelIndex = levelOrder.indexOf(userLevel);

	const filteredAccessible = articles.filter(
		(a) =>
			levelOrder.indexOf(a.levelRequired) <= userLevelIndex &&
			a.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredLocked = lockedArticles.filter((a) =>
		a.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (isLoading) return <p>Laddar artiklar...</p>;

	return (
		<>
			<ArticleList articles={filteredAccessible} />
			{filteredLocked.length > 0 && (
				<>
					<h2 className='text-1xl font-bold mt-8 mb-2'>
						Lås upp fler artiklar med högre prenumeration
					</h2>
					<ul className='space-y-2'>
						{filteredLocked.map((article) => (
							<li
								key={article.id}
								className='border-b border-gray-700 py-3 px-4 rounded bg-gray-400 opacity-60 cursor-pointer'
								onClick={() => navigate('/subscriptions')}
								tabIndex={0}
								style={{ pointerEvents: 'auto' }}
								title='Klicka för att uppgradera din prenumeration'
							>
								<div>
									<strong className='text-blue-400'>{article.title} </strong>
									<strong className='text-black-400'>
										({levelNames[article.levelRequired]})
									</strong>
									<span className='ml-2 text-sm text-gray-700'>(Lås upp)</span>
								</div>
							</li>
						))}
					</ul>
				</>
			)}
		</>
	);
};
