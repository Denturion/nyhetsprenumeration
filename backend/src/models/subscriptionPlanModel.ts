import { db } from '../config/db';

export const getAllSubscriptionPlans = async () => {
  const [rows] = await db.query('SELECT * FROM subscription_plans');
  return rows;
};
