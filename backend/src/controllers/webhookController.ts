import { Request, Response } from "express";
import stripe from "../config/stripe";
import { db } from "../config/db";
import { IUser } from "../interfaces/IUser";
import Stripe from "stripe";

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

    const eventType = event.type;
    const data = event.data.object as any;

    switch (eventType) {
      case "checkout.session.completed": {
        const session = data as Stripe.Checkout.Session;
        const customerEmail = session.customer_email;
        const subscriptionId = session.subscription as string;
        const paymentIntentId =
          (session.payment_intent as string) || session.id;

        if (!customerEmail || !subscriptionId) {
          console.error("Missing email or subscriptionId in session.");
          res.status(400).json({ error: "Missing email or subscriptionId" });
          return;
        }

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const priceId = subscription.items.data[0].price.id;

        const priceMap: Record<string, "basic" | "plus" | "full"> = {
          price_1RUPsS4E2OXMiKqH6Wx2FQIJ: "basic",
          price_1RUOIJ4E2OXMiKqHqFEh7JVs: "plus",
          price_1RUOKf4E2OXMiKqH0ZCBA7ea: "full",
        };

        const newLevel = priceMap[priceId];

        if (!newLevel) {
          console.error("Unknown priceId:", priceId);
          res.status(400).json({ error: "Unknown subscription level" });
          return;
        }

        const [userRows] = await db.query<IUser[]>(
          "SELECT * FROM User WHERE email = ?",
          [customerEmail]
        );

        if (userRows.length === 0) {
          console.error("User not found for email:", customerEmail);
          res.status(400).json({ error: "User not found" });
          return;
        }

        const user = userRows[0];
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await db.query(
          `UPDATE User 
           SET subscriptionLevel = ?, subscriptionExpiresAt = ?, isActive = 1, stripeSubscriptionId = ?
           WHERE id = ?`,
          [newLevel, expiresAt, subscription.id, user.id]
        );

        const stripeStatus =
          session.status === "complete" ? "succeeded" : "failed";

        await db.query(
          `INSERT INTO Payment (userId, stripePaymentId, status) 
           VALUES (?, ?, ?)`,
          [user.id, paymentIntentId, stripeStatus]
        );

        console.log("User and payment inserted:", {
          email: customerEmail,
          newLevel,
          stripeStatus,
          subscriptionId,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data as Stripe.Subscription;
        const stripeSubId = subscription.id;

        const [userRows] = await db.query<IUser[]>(
          "SELECT id FROM User WHERE stripeSubscriptionId = ?",
          [stripeSubId]
        );

        if (userRows.length === 0) {
          console.warn("No user found for subscriptionId:", stripeSubId);
          break;
        }

        const user = userRows[0];

        await db.query(
          `UPDATE User
           SET subscriptionLevel = 'free',
               subscriptionExpiresAt = NULL,
               isActive = 0,
               stripeSubscriptionId = NULL
           WHERE id = ?`,
          [user.id]
        );

        console.log("Subscription fully canceled for user:", user.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = data as any;

        const stripeSubId = invoice.subscription as string;
        const paymentIntentId = invoice.payment_intent as string;

        if (!stripeSubId || !paymentIntentId) {
          console.warn("Missing subscription or payment intent ID in invoice.");
          break;
        }

        const [userRows] = await db.query<IUser[]>(
          "SELECT id FROM User WHERE stripeSubscriptionId = ?",
          [stripeSubId]
        );

        if (userRows.length === 0) {
          console.warn("No user found for failed subscription:", stripeSubId);
          break;
        }

        const user = userRows[0];

        await db.query(
          `INSERT INTO Payment (userId, stripePaymentId, status)
     VALUES (?, ?, ?)`,
          [user.id, paymentIntentId, "failed"]
        );

        console.warn("Payment failure recorded for user:", user.id);
        break;
      }

      default:
        console.log(`Event type '${eventType}' not handled.`);
        break;
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
