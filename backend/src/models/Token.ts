export interface TokenPayload {
  id: number;
  email: string;
  subscriptionLevel: 'free' | 'basic' | 'plus' | 'full';
  role: 'user' | 'admin';
}
