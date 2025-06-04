import { Request, Response } from "express";
import stripe from "../config/stripe";
import { getAllSubscriptionPlans } from "../models/subscriptionPlanModel";

export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { priceId, customerEmail } = req.body;

  if (!priceId || !customerEmail) {
    res.status(400).json({ error: "Saknar pris-ID eller e-postadress" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", 
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      customer_email: customerEmail, 
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
      cancel_url: `${process.env.FRONTEND_URL}/subscriptions`,
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Stripe session error:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.error("Unknown error creating Stripe session:", err);
      res
        .status(500)
        .json({ error: "Något gick fel vid skapandet av session" });
    }
  }
};

export const getSubscriptionPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plans = await getAllSubscriptionPlans();
    res.json(plans);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Fel vid hämtning av prenumerationer:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.error("Okänt fel vid hämtning av prenumerationer:", err);
      res.status(500).json({ error: "Kunde inte hämta prenumerationer" });
    }
  }
};

export const getSessionDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    res.json(session);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Kunde inte hämta session:", err.message);
      res.status(404).json({ error: err.message });
    } else {
      console.error("Okänt fel vid hämtning av session:", err);
      res.status(404).json({ error: "Sessionen kunde inte hittas" });
    }
  }
};
