import { Link } from "react-router-dom";
import logoImg from "../assets/DKG-Logo.png";
import coverImg from "../assets/beerPong.png";
import RandomGames from "../components/RandomGames";
import RandomProducts from "../components/RandomProducts";
import PregameTips from "../components/PregameTips";
import MedievalNewsletter from "../components/Newsletter";

import "../style/home.css"

export default function Home() {
  const brandHighlights = [
    "🎉 Party Games for Every Occasion",
    "🧠 New Additions Every Month",
    "🚀 Elevate your game nights",
    "🍻 Perfect for Pregames",
  ];

  return (
    <div className="text-gray-800">

      {/* Hero Section with Cover Image and Overlay */}
      <section className="relative h-[80vh] flex items-center justify-center text-center text-white">
        <img
          src={coverImg}
          alt="Drunk Knight Games Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80"></div>

        <div className="relative z-10 flex flex-col items-center px-6">
          <img
            src={logoImg}
            alt="Drunk Knight Games"
            className="h-40 w-auto mb-6 drop-shadow-lg"
          />
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
            Party harder, laugh louder, and play smarter with our collection of creative board games
            made for unforgettable nights.
          </p>
          <Link
            to="/shop"
            className="bg-[#F4761B] hover:bg-[#ff7b3a] border-2 text-white font-semibold px-8 py-3 rounded-full text-lg transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Brand Highlights Scrolling Banner */}
      <section className="bg-[#6B0899] py-4 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap text-white font-semibold text-lg gap-12">
          {brandHighlights.map((msg, index) => (
            <span key={index}>{msg}</span>
          ))}
          {brandHighlights.map((msg, index) => (
            <span key={`dup-${index}`}>{msg}</span>
          ))}
        </div>
      </section>
      
      <RandomGames />

      <RandomProducts />
      
      <PregameTips />
      
      <MedievalNewsletter />
      
    </div>
  );
}
