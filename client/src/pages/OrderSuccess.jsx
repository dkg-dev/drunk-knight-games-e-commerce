import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderSuccess() {
  const { cartItems, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Calculate total
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) + 5; // assuming flat shipping of 5

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentIntent = query.get("payment_intent");
    const paymentStatus = query.get("redirect_status");

    if (paymentStatus === "succeeded" && paymentIntent) {
      setPaymentInfo({ paymentIntent, status: paymentStatus });

      // Clear cart after successful payment
      clearCart();
    } else {
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
    <div className="max-w-4xl mx-auto p-6 bg-green-50 min-h-screen flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-green-700 mb-2">
        🎉 Payment Successful!
      </h1>
      <p className="text-gray-700 mb-4">
        Thank you for your purchase! Your payment has been processed.
      </p>
      <p className="text-gray-600 mb-6">
        Payment Intent ID: <span className="font-mono">{paymentInfo.paymentIntent}</span>
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex items-center gap-4">
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

        <div className="mt-4 border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total (including €5 shipping):</span>
          <span>€{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <a
        href="/shop"
        className="self-start bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition mt-6"
      >
        Continue Shopping
      </a>
    </div>
  );
}
