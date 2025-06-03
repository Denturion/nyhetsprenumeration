import { Request, Response } from "express";
import stripe from "../config/stripe";
import { getAllSubscriptionPlans } from "../models/subscriptionPlanModel";

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await getAllSubscriptionPlans();
    res.json(plans);
  } catch (err: any) {
    console.error("Fel vid hämtning av prenumerationer:", err.message);
    res.status(500).json({ error: "Kunde inte hämta prenumerationer" });
  }
};

export const getSessionDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    res.json(session);
  } catch (err: any) {
    console.error("Kunde inte hämta session:", err.message);
    res.status(404).json({ error: "Sessionen kunde inte hittas" });
  }
};

