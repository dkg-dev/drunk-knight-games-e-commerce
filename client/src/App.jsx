import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Games from "./pages/Games";
import Test from "./pages/test"
import GameDetails from "./pages/GameDetails"
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";


function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <CartSidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/shop/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/test" element={<Test />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        
      </Router>
    </CartProvider>
  );
}

export default App;
