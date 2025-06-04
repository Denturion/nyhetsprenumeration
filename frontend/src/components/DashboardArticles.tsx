import type { ArticleData } from '../models/ArticleOutput';
import { ArticleList } from './ArticleList';

interface DashboardArticlesProps {
	articles: ArticleData[];
	userLevel: string;
	isLoading: boolean;
}

const levelOrder = ['free', 'basic', 'plus', 'full'];

export const DashboardArticles = ({
	articles,
	userLevel,
	isLoading,
}: DashboardArticlesProps) => {
	const userLevelIndex = levelOrder.indexOf(userLevel);

	const accessibleArticles = articles.filter(
		(article) => levelOrder.indexOf(article.levelRequired) <= userLevelIndex
	);
	const lockedArticles = articles.filter(
		(article) => levelOrder.indexOf(article.levelRequired) > userLevelIndex
	);

	if (isLoading) return <p>Laddar artiklar...</p>;

	return (
		<>
			<h2 className='text-2xl font-bold mb-2'>Dina artiklar</h2>
			<ArticleList articles={accessibleArticles} />
			{lockedArticles.length > 0 && (
				<>
					<h2 className='text-2xl font-bold mt-8 mb-2'>
						Lås upp fler artiklar med högre prenumeration
					</h2>
					<ArticleList articles={lockedArticles} />
				</>
			)}
		</>
	);
};
