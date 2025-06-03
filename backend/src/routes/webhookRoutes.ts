import express from "express";
import bodyParser from "body-parser";
import { handleStripeWebhook } from "../controllers/webhookController";

const router = express.Router();

router.post(
  "/",
  (req, res, next) => {
    console.log("🔵 Steg 1: webhook route anropad");
    next();
  },
  bodyParser.raw({ type: "application/json" }), // 👈 MÅSTE vara raw!
  (req, res, next) => {
    console.log("🟢 Steg 2: raw body-parser klar");
    next();
  },
  handleStripeWebhook
);

export default router;
