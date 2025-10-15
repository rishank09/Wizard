import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ParticleBackground from "./particleBackground";
import vidi from "../assets/vidi.png"; // make sure path is correct

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col lg:flex-row items-center justify-between
      bg-gradient-to-b from-[#0b002b] via-[#1a0033] to-[#0b002b]
      text-gray-100 min-h-screen overflow-hidden px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32"
    >
      {/* Particle background */}
      <ParticleBackground />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[url(/gradientBackground.png)] bg-cover bg-center opacity-20 animate-pulse-slow"></div>

      {/* Text Content */}
      <div className="relative z-10 flex-1 text-center lg:text-left mt-16 sm:mt-20 lg:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-semibold leading-tight mx-auto lg:mx-0 px-2">
          Summon your creativity <br />
          <span className="text-[#9b59b6]">with Vidi the Wizard</span>
        </h1>

        <p className="mt-4 max-w-xs sm:max-w-md md:max-w-lg m-auto lg:m-0 text-sm sm:text-base text-gray-400 px-3">
          Speak your wish and Vidi will cast the spell. Generate articles,
          create magical images, remove backgrounds, and transform your ideas
          effortlessly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 mt-8 px-3">
          <button
            onClick={() => navigate("/ai")}
            className="bg-[#9b59b6] text-white px-8 py-3 rounded-xl hover:scale-105 
            active:scale-95 transition cursor-pointer shadow-lg shadow-purple-600/40 w-full sm:w-auto"
          >
            ✨ Cast Your First Spell
          </button>

          <button
            className="bg-transparent px-8 py-3 rounded-xl border border-gray-600 
            hover:bg-gray-800 active:scale-95 transition cursor-pointer text-gray-300 w-full sm:w-auto"
          >
            🎥 Watch Vidi in Action
          </button>
        </div>
      </div>

      {/* Wizard Image */}
      <div className="relative z-10 flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
        <div className="relative">
          {/* Glow behind image */}
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 blur-3xl -z-10"></div>

          <img
            src={vidi}
            alt="Vidi the Wizard"
            className="w-48 sm:w-56 md:w-64 lg:w-72 2xl:w-80 object-contain animate-float"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
