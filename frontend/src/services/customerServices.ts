import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function register(
	email: string,
	password: string,
	subscriptionLevel: string
) {
	const res = await axios.post(`${API_URL}/register`, {
		email,
		password,
		subscriptionLevel,
	});
	return res.data;
}

export async function login(email: string, password: string) {
	const res = await axios.post(`${API_URL}/login`, { email, password });
	return res.data;
}
