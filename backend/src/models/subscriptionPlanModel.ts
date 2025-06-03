import { db } from "../config/db";

export const getAllSubscriptionPlans = async () => {
  const [rows] = await db.query(`
    SELECT * FROM subscription_plans
    ORDER BY FIELD(id,
      'price_1RUPsS4E2OXMiKqH6Wx2FQIJ',   -- FiskePass
      'price_1RUOIJ4E2OXMiKqHqFEh7JVs',   -- FiskeGuide
      'price_1RUOKf4E2OXMiKqH0ZCBA7ea'    -- MästerFiskare
    )
  `);
  return rows;
};
