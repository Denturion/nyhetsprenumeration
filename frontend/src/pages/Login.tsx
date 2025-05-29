export const Login = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<h1 className='text-4xl font-bold mb-4'>Login Page</h1>
			<form className='bg-white p-6 rounded shadow-md w-80'>
				<div className='mb-4'>
					<label
						className='block text-sm font-medium text-gray-700'
						htmlFor='username'
					>
						Username
					</label>
					<input
						type='text'
						id='username'
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
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
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
						required
					/>
				</div>
				<button
					type='submit'
					className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'
				>
					Log In
				</button>
			</form>
		</div>
	);
};
