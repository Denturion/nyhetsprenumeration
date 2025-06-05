import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';

import { DashboardArticles } from '../components/DashboardArticles';
import { cancelSubscription } from '../services/customerServices';

export const Dashboard = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<{
		email?: String;
		subscriptionLevel?: string;
		subscriptionExpiresAt?: string;
	} | null>(null);
	const [pagenumber, setPagenumber] = useState<number>(1);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [inputValue, setInputValue] = useState<string>("");
	const { articles, isloading,totalPages,getallArticles } = useArticle();

	useEffect(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
			const payload = JSON.parse(atob(token.split('.')[1]));
			setUser(payload);
		}
	}, []);

	 useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue);
      getallArticles(1, undefined, inputValue);
    }, 800);
    return () => clearTimeout(timeout);
  }, [inputValue]);

	const handlePage = (direction: "prev" | "next") => {
    if (pagenumber === totalPages && direction === "next") {
      return;
    }
    setPagenumber((prev) => {
      const nextPage = direction === "next" ? prev + 1 : Math.max(1, prev - 1);
      getallArticles(nextPage,undefined, searchQuery);
      return nextPage;
    });
  };


	const handleCancel = async () => {
		const token = sessionStorage.getItem('token');
		if (!token) {
			alert('Ingen token hittades. Logga in igen.');
			return;
		}

		try {
			await cancelSubscription(token);
			setUser((prev) =>
				prev
					? {
							...prev,
							subscriptionLevel: 'free',
							subscriptionExpiresAt: undefined,
					  }
					: null
			);
			alert('Prenumerationen har avslutats.');
		} catch (error) {
			console.error('Kunde inte avsluta prenumeration:', error);
			alert('Något gick fel.');
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			{user ? (
				<div>
					<h1 className='text-4xl font-bold mb-4'>Dashboard</h1>
					<input
              placeholder="Sök på titel"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 p-2 rounded text-white"
            />
					<p className='text-lg'>Välkommen, {user.email}!</p>
					<p>
						<strong>Prenumeration: {user.subscriptionLevel}</strong>
					</p>
					<p>
						Prenumeration gäller till:{' '}
						{user.subscriptionExpiresAt
							? new Date(user.subscriptionExpiresAt).toLocaleDateString('sv-SE')
							: 'okänt'}
					</p>
					<button
						onClick={handleCancel}
						className='mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
					>
						Ta bort prenumeration
					</button>
					<DashboardArticles
						articles={articles}
						userLevel={user.subscriptionLevel || 'free'}
						isLoading={isloading}
					/>
					<div>
						 <button
              onClick={() => handlePage("prev")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Föregående
            </button>
            <button
              onClick={() => handlePage("next")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Nästa
            </button>
					</div>
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
