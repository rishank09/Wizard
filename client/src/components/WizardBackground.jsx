import React from "react";

const WizardBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b002b] via-[#150040] to-[#0b002b]" />

      {/* Soft glowing stars */}
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-70"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Few smooth shooting stars */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`shoot-${i}`}
          className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-70 animate-shoot"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${i * 5}s`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }
          @keyframes shoot {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translate(-300px, 300px) scale(1); opacity: 0; }
          }
          .animate-shoot {
            animation: shoot 6s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default WizardBackground;
