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
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<h1 className='text-4xl font-bold mb-4'>Skapa konto</h1>
			<form
				onSubmit={handleSubmit}
				className='bg-white p-6 rounded shadow-md w-80'
			>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-700'
						htmlFor='email'
					>
						Email
					</label>
					<input
						type='email'
						id='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-700'
						htmlFor='password'
					>
						Lösenord
					</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='text-black mt-1 block w-full px-3 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
						required
					/>
				</div>

				<button
					type='submit'
					className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200'
				>
					Gå till betalning
				</button>
				{message && <p className='mt-4 text-center text-red-600'>{message}</p>}
			</form>
		</div>
	);
};
