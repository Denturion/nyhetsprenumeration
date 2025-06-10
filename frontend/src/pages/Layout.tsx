import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const Layout = () => {
	const [isadmin, setIsadmin] = useState<boolean>(false);

	const token = sessionStorage.getItem('token');

	useEffect(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				if (payload.role === 'admin') {
					setIsadmin(true);
				}
			} catch (err) {
				console.error('Invalid token', err);
			}
		}
	}, []);

	return (
		<>
			<div className='min-h-screen flex flex-col bg-gray-900 text-white'>
				<header className='bg-gray-800 shadow-md'>
					<nav className='max-w-6xl mx-auto px-4 py-4 flex justify-between items-center'>
						<h1 className='text-xl font-bold text-white'>Huggtid</h1>
						<ul className='flex space-x-6'>
							{/* <li>
								<NavLink
									to='/'
									className={({ isActive }) =>
										`hover:text-blue-400 transition ${
											isActive ? 'text-blue-400 font-semibold' : ''
										}`
									}
								>
									Start
								</NavLink>
							</li> */}
							{isadmin && (
								<li>
									<NavLink
										to='/admin/article'
										className={({ isActive }) =>
											`hover:text-blue-400 transition ${
												isActive ? 'text-blue-400 font-semibold' : ''
											}`
										}
									>
										admin
									</NavLink>
								</li>
							)}
							<li>
								<NavLink
									to={token ? '/dashboard' : '/login'}
									className={({ isActive }) =>
										`hover:text-blue-400 transition ${
											isActive ? 'text-blue-400 font-semibold' : ''
										}`
									}
								>
									{token ? 'Dashboard' : 'Logga in'}
								</NavLink>
							</li>
							{!token && (
								<li>
									<NavLink
										to='/register'
										className={({ isActive }) =>
											`hover:text-blue-400 transition ${
												isActive ? 'text-blue-400 font-semibold' : ''
											}`
										}
									>
										Skapa konto
									</NavLink>
								</li>
							)}
						</ul>
					</nav>
				</header>

				<main className='flex-grow max-w-6xl mx-auto px-4 py-8'>
					<Outlet />
				</main>
				<footer className='bg-gray-800 text-center py-4 text-sm text-gray-400'>
					&copy; {new Date().getFullYear()} Huggtid. Alla rättigheter
					förbehållna.
				</footer>
			</div>
		</>
	);
};
