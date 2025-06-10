import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/customerServices';

export const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [subscriptionLevel] = useState('free');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			await register(email, password, subscriptionLevel);

			sessionStorage.setItem(
				'registration',
				JSON.stringify({ email, subscriptionLevel })
			);
			navigate('/subscriptions');
		} catch (error: any) {
			setMessage(error.response?.data?.message || 'Registrering misslyckades');
		}
	};

	return (
		<div className='flex flex-col items-center justify-center flex-grow bg-gray-900'>
			<h1 className='text-4xl font-bold mb-4 text-white'>Skapa konto</h1>
			<form
				onSubmit={handleSubmit}
				className='bg-gray-800 p-6 rounded shadow-md w-80'
			>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-200'
						htmlFor='email'
					>
						Email
					</label>
					<input
						type='email'
						id='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='text-white bg-gray-700 mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-200'
						htmlFor='password'
					>
						Lösenord
					</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='text-white bg-gray-700 mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
						required
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200'
				>
					Gå till betalning
				</button>
				{message && <p className='mt-4 text-center text-red-400'>{message}</p>}
				<button
					type='button'
					onClick={() => navigate('/login')}
					className='mt-4 w-full text-blue-400 hover:underline'
				>
					Har du redan ett konto? Logga in här.
				</button>
			</form>
		</div>
	);
};
