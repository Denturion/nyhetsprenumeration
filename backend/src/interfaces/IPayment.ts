import { RowDataPacket } from "mysql2";

export interface IPayment extends RowDataPacket {
  id: number;
  userId: number;
  stripePaymentId: string;
  status: 'succeeded' | 'failed';
  createdAt: Date;
}