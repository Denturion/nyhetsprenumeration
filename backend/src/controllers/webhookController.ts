import { Request, Response } from "express";
import stripe from "../config/stripe";
import { db } from "../config/db";
import { IPlan } from "../interfaces/IPlan"; 
import { IUser } from "../interfaces/IUser";
import Stripe from "stripe";

export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email;
      const subscriptionId = session.subscription as string;
      const paymentIntentId = session.payment_intent as string || session.id;

      if (!customerEmail || !subscriptionId) {
        res.status(400).json({ error: "Missing email or subscriptionId" });
        return;
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      const [planRows] = await db.query<IPlan[]>(
        "SELECT * FROM subscription_plans WHERE id = ?",
        [priceId]
      );
      const plan = planRows[0];
      if (!plan) {
        res.status(400).json({ error: "No matching plan found" });
        return;
      }

      const [userRows] = await db.query<IUser[]>(
        "SELECT * FROM User WHERE email = ?",
        [customerEmail]
      );
      if (userRows.length === 0) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const user = userRows[0];
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.query(
        `UPDATE User SET subscriptionLevel = ?, subscriptionExpiresAt = ?, isActive = 1 WHERE id = ?`,
        [plan.name.toLowerCase(), expiresAt, user.id]
      );

      await db.query(
        `INSERT INTO Payment (userId, stripePaymentId, status) VALUES (?, ?, 'succeeded')`,
        [user.id, paymentIntentId]
      );

      console.log("User and payment updated.");
    }

    res.status(200).json({ received: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Webhook error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    } else {
      console.error("Unknown webhook error:", err);
      res.status(400).send("Unknown error occurred");
    }
  }
};

