import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';

import { DashboardArticles } from '../components/DashboardArticles';

export const Dashboard = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<{
		email?: String;
		subscriptionLevel?: string;
	} | null>(null);
	const { articles, isloading, getallArticles } = useArticle();

	useEffect(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
			const payload = JSON.parse(atob(token.split('.')[1]));
			setUser(payload);
		}
	}, []);

	useEffect(() => {
		if (user?.subscriptionLevel) {
			getallArticles(1, user.subscriptionLevel);
		}
	}, [user]);

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			{user ? (
				<div>
					<h1 className='text-4xl font-bold mb-4'>Dashboard</h1>
					<p className='text-lg'>Välkommen, {user.email}!</p>
					<p>Prenumeration: {user.subscriptionLevel}</p>
					<DashboardArticles
						articles={articles}
						userLevel={user.subscriptionLevel || 'free'}
						isLoading={isloading}
					/>

					<button
						type='button'
						onClick={() => {
							sessionStorage.removeItem('token');
							setUser(null);
							navigate('/');
						}}
						className='mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200'
					>
						Logga ut
					</button>
				</div>
			) : (
				<div>
					<p>Du är inte inloggad.</p>
					<button
						type='button'
						onClick={() => navigate('/login')}
						className='mt-4 text-blue-600 hover:underline'
					>
						Klicka här för att logga in.
					</button>
				</div>
			)}
		</div>
	);
};
