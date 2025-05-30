import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SingleArticlePage } from './pages/SingleArticlePage';
import { Register } from './pages/Register';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/register',
				element: <Register />,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,
			},
			{
				path: '/article/:id',
				element: <SingleArticlePage />,
			},
		],
	},
]);
