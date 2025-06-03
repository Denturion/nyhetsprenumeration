export type SubscriptionLevel = 'basic' | 'plus' | 'full';

export interface RegisterRequest {
	email: string;
	password: string;
	subscriptionLevel?: SubscriptionLevel;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface User {
	id: number;
	email: string;
	subscriptionLevel: SubscriptionLevel;
	subscriptionExpiresAt?: string | null;
	isActive: boolean;
	createdAt: string;
}

export interface AuthResponse {
	token: string;
}
