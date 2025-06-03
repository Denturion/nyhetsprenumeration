import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SingleArticlePage } from './pages/SingleArticlePage';
import { AdminArticlepage } from './pages/AdminArticlepage';
import { Testpage } from './pages/testpage';

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
				path: '/test',
				element: <Testpage/>,
			},
			{
				path: '/login',
				element: <Login />,
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
	{
		path: '/admin',
		element: <App />,
		children: [
			{
				path: 'article',
				element: <AdminArticlepage />,
			}
			
		],
	},
]);
