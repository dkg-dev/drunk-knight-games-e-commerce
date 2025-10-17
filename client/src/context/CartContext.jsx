import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabaseClient";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hasLoadedCart, setHasLoadedCart] = useState(false); // Track initial load

  // Get current user session from Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Load cart from Supabase for logged-in users
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      const { data, error } = await supabase
        .from("UserCart")
        .select("cart_data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) console.error("Error fetching cart:", error);
      else setCartItems(data?.cart_data || []);

      setHasLoadedCart(true); // mark cart as loaded
    };

    fetchCart();
  }, [user]);

  // Save cart to Supabase whenever it changes (after initial load)
  useEffect(() => {
    if (!user || !hasLoadedCart) return;

    const saveCart = async () => {
      const { error } = await supabase
        .from("UserCart")
        .upsert(
          { user_id: user.id, cart_data: cartItems, updated_at: new Date() },
          { onConflict: "user_id" } // ensure unique row per user
        );

      if (error) console.error("Error saving cart:", error);
    };

    saveCart();
  }, [cartItems, user, hasLoadedCart]);

  // Guest cart: load from localStorage
  useEffect(() => {
    if (user) return; // skip for logged-in users
    const storedCart = localStorage.getItem("guestCart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, [user]);

  // Guest cart: save to localStorage
  useEffect(() => {
    if (user) return; // skip for logged-in users
    localStorage.setItem("guestCart", JSON.stringify(cartItems));
  }, [cartItems, user]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // Total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
