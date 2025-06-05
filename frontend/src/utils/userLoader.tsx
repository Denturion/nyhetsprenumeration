import { redirect } from 'react-router-dom';

export const userLoader = () => {
	if (sessionStorage.getItem('token')) {
		return redirect('/dashboard');
	}
	return null;
};
