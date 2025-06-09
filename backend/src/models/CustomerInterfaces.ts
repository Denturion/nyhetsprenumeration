export interface User {
	id: number;
	email: string;
	password_hash: string;
	subscriptionLevel: 'free' | 'basic' | 'plus' | 'full';
	subscriptionExpiresAt: Date | null;
	isActive: boolean;
	createdAt: Date;
	subscriptionCanceled:boolean;
}

export interface RegisterRequest {
	email: string;
	password: string;
	subscriptionLevel?: 'free' | 'basic' | 'plus' | 'full';
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface UpdateSubscriptionRequest {
	subscriptionLevel: 'free' | 'basic' | 'plus' | 'full';
}
