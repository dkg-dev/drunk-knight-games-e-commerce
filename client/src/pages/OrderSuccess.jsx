import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Parse query params from Stripe redirect
    const query = new URLSearchParams(location.search);
    const paymentIntent = query.get("payment_intent");
    const paymentStatus = query.get("redirect_status");

    if (paymentStatus === "succeeded" && paymentIntent) {
      setPaymentInfo({ paymentIntent, status: paymentStatus });

      // Clear the cart after successful payment
      clearCart();
    } else {
      // Redirect to failure page if needed
      navigate("/order-failure");
    }
  }, [location.search, clearCart, navigate]);

  if (!paymentInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-xl">Loading payment info...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-700 mb-4">
        Thank you for your purchase! Your payment has been processed.
      </p>
      <p className="text-gray-600 mb-6">
        Payment Intent ID: <span className="font-mono">{paymentInfo.paymentIntent}</span>
      </p>
      <a
        href="/shop"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Continue Shopping
      </a>
    </div>
  );
}
