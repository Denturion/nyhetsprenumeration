import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/customerServices';

export const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		try {
			const data = await login(email, password);
			sessionStorage.setItem('token', data.token);
			navigate('/dashboard');
		} catch (error: any) {
			setMessage(error.response?.data?.message || 'Inloggning misslyckades');
		}
	};

	useEffect(() => {
		sessionStorage.removeItem('hasReloadedAfterSuccess');
	}, []);

	return (
		<div className='flex flex-col items-center justify-center flex-grow bg-gray-900'>
			<h1 className='text-4xl font-bold mb-4 text-white'>Logga in</h1>
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
						Password
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
					className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'
				>
					Logga in
				</button>
				{message && <p className='mt-4 text-center text-red-400'>{message}</p>}
				<button
					type='button'
					onClick={() => navigate('/register')}
					className='mt-4 w-full text-blue-400 hover:underline'
				>
					Har du inget konto? Klicka här för att registrera dig.
				</button>
			</form>
		</div>
	);
};
