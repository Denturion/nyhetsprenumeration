import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  subscriptionLevel: 'basic' | 'plus' | 'full';
  subscriptionExpiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  role: 'user' | 'admin';
}