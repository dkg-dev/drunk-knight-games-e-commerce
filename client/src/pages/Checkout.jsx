import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white py-3 mt-4 rounded hover:bg-green-700 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cartItems, total } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  const totalAmount = Math.round((total + 5) * 100); 

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log("💰 Sending amount to server:", totalAmount);

        const res = await fetch("/.netlify/functions/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        });

        const data = await res.json();

        if (res.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Server returned error:", data);
        }
      } catch (err) {
        console.error("Error fetching client secret:", err);
      }
    };

    if (cartItems.length > 0) createPaymentIntent();
  }, [totalAmount, cartItems.length]);

  if (cartItems.length === 0)
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Checkout 💳</h1>
        <p className="text-gray-600">Your cart is empty.</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-800 transition"
        >
          Go Shopping
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col lg:flex-row gap-8">
      {/* Left Side: Payment */}
      <div className="flex-1 max-h-[80vh] overflow-y-auto border p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        ) : (
          <p>Loading payment form...</p>
        )}
      </div>

      {/* Right Side: Cart Summary */}
      <div className="w-full lg:w-1/3 border p-6 rounded-lg shadow-md flex flex-col justify-between">
        <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-3 mb-3"
          >
            <div className="flex items-center space-x-3">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">
                  {item.quantity} × €{item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="font-semibold">
              €{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping:</span>
            <span>€5.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total:</span>
            <span>€{(total + 5).toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-800 transition mb-2"
          >
            Edit Cart
          </button>
        </div>
      </div>
    </div>
  );
}
