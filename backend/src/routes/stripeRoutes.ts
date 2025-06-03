import express, { Request, Response } from "express";
import {
  createCheckoutSession,
  getSubscriptionPlans,
  getSessionDetails
} from "../controllers/stripeController";

const router = express.Router();

//get routes
router.get("/plans", getSubscriptionPlans);

//post routes
router.post("/create-session", createCheckoutSession);

//get routes
router.get("/session/:id", getSessionDetails);

export default router;
