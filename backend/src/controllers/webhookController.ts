import { Request, Response } from "express";
import stripe from "../config/stripe";
import { db } from "../config/db";

export const handleStripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🟣 Steg 3: controller startar");
  const sig = req.headers["stripe-signature"] as string;

  try {
    console.log("📦 Försöker skapa Stripe-event...");
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Event mottaget:", event.type);

    if (event.type === "checkout.session.completed") {
      console.log("Webhook fungerade! Event: checkout.session.completed");

      const session = event.data.object as any;
      const customerEmail = session.customer_email;
      const subscriptionId = session.subscription;
      const paymentIntentId = session.payment_intent || session.id;

      if (!customerEmail || !subscriptionId) {
        console.warn("Saknar email eller subscriptionId");
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
        console.error("Ingen plan hittad för priceId:", priceId);
        res.sendStatus(400);
        return;
      }

      const [users]: any = await db.query(
        "SELECT * FROM User WHERE email = ?",
        [customerEmail]
      );
      if (users.length === 0) {
        console.error("Ingen användare hittad med email:", customerEmail);
        res.sendStatus(400);
        return;
      }

      const user = users[0];
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dagar

      await db.query(
        `UPDATE User SET subscriptionLevel = ?, subscriptionExpiresAt = ?, isActive = 1 WHERE id = ?`,
        [plan.name.toLowerCase(), expiresAt, user.id]
      );
      console.log("Användare uppdaterad:", customerEmail);

      await db.query(
        `INSERT INTO Payment (userId, stripePaymentId, status) VALUES (?, ?, 'succeeded')`,
        [user.id, paymentIntentId]
      );
      console.log("Betalning loggad för användare:", user.id);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
