import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SingleArticlePage } from './pages/SingleArticlePage';
import { Subscriptions } from './pages/Subscriptions';
import { MySubscriptions } from './pages/MySubscriptions';
import { SuccessPage } from './pages/SuccessPage';
import { AdminArticlepage } from './pages/AdminArticlepage';
import { Testpage } from './pages/testpage';
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
				path: '/test',
				element: <Testpage/>,
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
			{
				path: '/subscriptions',
				element: <Subscriptions />,
			},
			{
				path: '/my-subscriptions',
				element: <MySubscriptions />,
			},
			{
				path: '/success',
				element: <SuccessPage />,
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
