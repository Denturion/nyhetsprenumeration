import axios from 'axios';
import type { AuthResponse } from '../models/CustomerModels';

const API_URL = import.meta.env.VITE_API_URL;

//Register function

export async function register(
	email: string,
	password: string,
	subscriptionLevel: string
): Promise<{ message: string }> {
	const res = await axios.post(`${API_URL}/register`, {
		email,
		password,
		subscriptionLevel,
	});
	return res.data;
}

//Login function

export async function login(
	email: string,
	password: string
): Promise<AuthResponse> {
	const res = await axios.post(`${API_URL}/login`, { email, password });
	return res.data;
}

//Update subscriptionLevel function

export async function updateSubscriptionLevel(
	subscriptionLevel: string,
	token: string
): Promise<{ message: string }> {
	const res = await axios.put(
		`${API_URL}/subscription`,
		{ subscriptionLevel },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return res.data;
}
