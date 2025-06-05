import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SingleArticlePage } from './pages/SingleArticlePage';
import { Subscriptions } from './pages/Subscriptions';
import { SuccessPage } from './pages/SuccessPage';
import { AdminArticlepage } from './pages/AdminArticlepage';
import { Register } from './pages/Register';
import { userLoader } from './utils/userLoader';
import { Layout } from './pages/Layout';
import { ProtectedAdminRoute } from './components/ProtectedRoute';


export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			{
				path: '/login',
				element: <Login />,
				loader: userLoader,
			},
			{
				path: '/register',
				element: <Register />,
				loader: userLoader,
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
				path: '/success',
				element: <SuccessPage />,
			},
		],
	},
	{
		path: '/admin',
		element: <Layout />,
		children: [
			{
				path: 'article',
				element:( <ProtectedAdminRoute><AdminArticlepage /></ProtectedAdminRoute>),
			},
		],
	},
]);
