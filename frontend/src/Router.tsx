import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SingleArticlePage } from './pages/SingleArticlePage';
import { Subscriptions } from './pages/Subscriptions';
import { MySubscriptions } from './pages/MySubscriptions';
import { SuccessPage } from './pages/SuccessPage';

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
]);
