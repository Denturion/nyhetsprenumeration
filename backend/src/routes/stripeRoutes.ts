import express, { Request, Response } from "express";
import {
  createCheckoutSession,
  getSubscriptionPlans,
  getSessionDetails
} from "../controllers/stripeController";

const router = express.Router();

//GET routes
router.get("/plans", getSubscriptionPlans);
router.get("/session/:id", getSessionDetails);

//POST routes
router.post("/create-session", createCheckoutSession);

export default router;
