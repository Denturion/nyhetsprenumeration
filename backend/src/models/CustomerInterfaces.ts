export interface User {
	id: number;
	email: string;
	password_hash: string;
	subscriptionLevel: 'basic' | 'plus' | 'full';
	subscriptionExpiresAt: Date | null;
	isActive: boolean;
	createdAt: Date;
}

export interface RegisterRequest {
	email: string;
	password: string;
	subscriptionLevel?: 'basic' | 'plus' | 'full';
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface UpdateSubscriptionRequest {
	subscriptionLevel: 'basic' | 'plus' | 'full';
}
