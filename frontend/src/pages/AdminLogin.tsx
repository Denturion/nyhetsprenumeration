export const AdminLogin = () => {
	return (
		<div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center mb-6'>Admin Login</h2>
				<form>
					<div className='mb-4'>
						<label
							className='block text-sm font-medium text-gray-700 mb-1'
							htmlFor='username'
						>
							Username
						</label>
						<input
							type='text'
							id='username'
							className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500'
							placeholder='Enter your username'
						/>
					</div>
					<div className='mb-6'>
						<label
							className='block text-sm font-medium text-gray-700 mb-1'
							htmlFor='password'
						>
							Password
						</label>
						<input
							type='password'
							id='password'
							className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500'
							placeholder='Enter your password'
						/>
					</div>
					<button
						type='submit'
						className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};
