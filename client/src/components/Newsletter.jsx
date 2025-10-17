import React from "react";
import { FaDragon } from "react-icons/fa"; 

export default function MedievalNewsletter() {
  return (
    <section className="bg-gradient-to-b from-[#6B0899] to-[#3e025e] text-white pt-15 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/path-to-parchment-texture.png')] bg-cover bg-center opacity-10 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex justify-center mb-4">
          <FaDragon className="text-[#F4761B] text-4xl animate-bounce" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif drop-shadow-lg">
          Join the Drunk Knight Guild
        </h2>

        <p className="text-lg md:text-xl text-[#F4761B]/80 mb-8 font-serif">
          Receive tales of new games, legendary deals, and epic events straight to your inbox.
        </p>

        <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-5 py-4 rounded-lg text-white w-full sm:w-2/3 focus:outline-none font-serif shadow-inner"
            required
          />
          <button
            type="submit"
            className="bg-[#F4761B] hover:bg-[#ff7b3a] px-4 py-2 rounded-lg font-semibold transition shadow-lg font-serif"
          >
            Enlist Now
          </button>
        </form>
      </div>
      <footer className=" text-[#F4761B] pt-10 py-4 text-center">
        <p>© {new Date().getFullYear()} DKG Development. All rights reserved.</p>
      </footer>
    </section>
    
  );
}
