import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Your Cart 🛒</h1>
        <p className="text-gray-600 mb-6">Your cart is currently empty.</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#6B0899] text-white px-6 py-3 rounded-lg shadow hover:bg-[#920ecf] transition-transform transform hover:scale-105"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 font-poppins">
      <h1 className="text-4xl font-bold mb-10 text-center">Your Cart 🛒</h1>

      {/* Cart Items */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b pb-6"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg shadow-sm"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500">€{item.price.toFixed(2)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3 mt-3">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="font-medium min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Price + Remove */}
            <div className="text-right sm:w-40">
              <p className="font-semibold text-lg">
                €{(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm mt-2 hover:text-red-600 flex items-center gap-1 justify-end"
              >
                <FiTrash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <button
          onClick={clearCart}
          className="text-red-500 hover:underline text-sm"
        >
          Clear Cart
        </button>

        <div className="text-right">
          <p className="text-2xl font-semibold mb-4">
            Total: <span>€{total.toFixed(2)}</span>
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-white hover:text-white px-4 py-2 border-2 border-green-700 rounded-full shadow hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
