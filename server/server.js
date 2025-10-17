import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://drunkknightgames.netlify.app",
}));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("Loaded Stripe key (starts with):", process.env.STRIPE_SECRET_KEY?.slice(0, 10));


app.post("/create-payment-intent", async (req, res) => {
  try {
    console.log("🪣 Received request body:", req.body); 
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).send({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
