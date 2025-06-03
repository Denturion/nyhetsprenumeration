import { useState } from 'react';
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

	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<h1 className='text-4xl font-bold mb-4'>Login Page</h1>
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
						Password
					</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
						required
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'
				>
					Log In
				</button>
				{message && <p className='mt-4 text-center text-red-600'>{message}</p>}
				<button
					type='button'
					onClick={() => navigate('/register')}
					className='mt-4 text-blue-600 hover:underline'
				>
					Don't have an account? Click here to register.
				</button>
			</form>
		</div>
	);
};
