import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { VscAccount } from "react-icons/vsc";
import { IoCartOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

import "../style/navbar.css"

import navLogoImg from "../assets/DKG-headerLogo.png";
import navLogoSmallImg from "../assets/DKG-headerLogo-small.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-white text-[#6B0899] px-6 py-4 flex justify-between items-center shadow-md relative z-50">
      {/* Hamburger Menu Button */}
      <button
        className="text-3xl focus:outline-none hover:text-[#F4761B] z-[60] transition-colors"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <MdClose className="text-2xl" /> : <GiHamburgerMenu className="text-2xl" />}
      </button>

      {/* Center Logo (responsive) */}
      <Link
        to="/"
        className="text-2xl font-bold hover:text-[#F4761B] transition-colors flex items-center justify-center"
      >
        {/* Large logo for screens ≥550px */}
        <img
          src={navLogoImg}
          alt="Drunk Knight Games"
          className="h-10 w-auto hidden xs:block transition-opacity duration-300 ease-in-out"
        />
        {/* Small logo for screens <550px */}
        <img
          src={navLogoSmallImg}
          alt="Drunk Knight Games"
          className="h-10 w-auto block xs:hidden transition-opacity duration-300 ease-in-out"
        />
      </Link>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-6">
        <Link to="/cart" className="hover:text-[#F4761B] transition-colors" aria-label="Cart">
          <IoCartOutline className="text-2xl" />
        </Link>

        {!user ? (
          <Link to="/login" className="hover:text-[#F4761B] transition-colors font-semibold">
            Login
          </Link>
        ) : (
          <Link to="/account" className="hover:text-[#F4761B] transition-colors" aria-label="Account">
            <VscAccount className="text-2xl" />
          </Link>
        )}
      </div>

      {/* Slide-in Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#6B0899] text-white w-[65%] sm:w-[250px] transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-xl z-[55]`}
      >
        <div className="flex flex-col p-6 space-y-6 mt-12 text-lg font-semibold">
          <Link
            to="/"
            className="hover:text-[#F4761B] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-[#F4761B] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/games"
            className="hover:text-[#F4761B] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Drinking Games
          </Link>
        </div>
      </div>
    </nav>
  );
}
