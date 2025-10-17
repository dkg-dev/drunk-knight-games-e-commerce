import { useCart } from "../context/CartContext";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { cartItems, total, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={() => setIsCartOpen(false)}>
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500 text-sm">
                  {item.quantity} × €{item.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">€{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              navigate("/checkout");
            }}
            className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-800 transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
