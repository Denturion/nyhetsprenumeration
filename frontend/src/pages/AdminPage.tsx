export const AdminPage = () => {
	return (
		<div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center mb-6'>Admin Dashboard</h2>
				<p className='text-gray-700 text-center mb-4'>
					Welcome to the admin dashboard. Here you can manage users, view
					reports, and configure settings.
				</p>
				<div className='flex flex-col space-y-4'>
					<button className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'>
						Manage Users
					</button>
					<button className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200'>
						View Reports
					</button>
					<button className='w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition duration-200'>
						Config Settings
					</button>
				</div>
			</div>
		</div>
	);
};
