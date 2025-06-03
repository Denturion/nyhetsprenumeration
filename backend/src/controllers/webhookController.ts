import { Request, Response } from "express";
import stripe from "../config/stripe";
import { db } from "../config/db";

export const handleStripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const customerEmail = session.customer_email;
      const subscriptionId = session.subscription;

      if (!customerEmail || !subscriptionId) {
        res.sendStatus(400);
        return;
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      const [plans]: any = await db.query(
        "SELECT * FROM subscription_plans WHERE id = ?",
        [priceId]
      );
      const plan = plans[0];
      if (!plan) {
        console.error("❌ Ingen plan hittad för priceId:", priceId);
        res.sendStatus(400);
        return;
      }

      // Uppdatera användaren baserat på e-post
      await db.query(
        `UPDATE User 
         SET subscriptionLevel = ?, 
             subscriptionExpiresAt = ?, 
             isActive = 1,
             createdAt = CURRENT_TIMESTAMP
         WHERE email = ?`,
        [
          plan.name.toLowerCase(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar framåt
          customerEmail,
        ]
      );

      console.log("✅ Användare uppdaterad:", customerEmail);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    console.error("❌ Full error:", err); // lägg till denna rad
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
