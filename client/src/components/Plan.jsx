import React from "react";
import { PricingTable } from "@clerk/clerk-react";
import WizardBackground from "./WizardBackground"; // ✅ Import starry background

const Plan = () => {
  return (
    <div className="relative px-6 sm:px-20 xl:px-32 py-24 text-gray-300 overflow-hidden">
      {/* 🌌 Shared animated background */}
      <WizardBackground />

      {/* Header */}
      <div className="relative z-10 text-center">
        <h2 className="text-white text-[38px] sm:text-[42px] font-semibold mb-3">
          Choose Your <span className="text-primary">Plan</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          Start for free and scale up as you grow.  
          Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* Pricing Table */}
      <div className="relative z-10 mt-14 max-sm:mx-4 bg-[#1e293b]/40 border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <PricingTable />
      </div>
    </div>
  );
};

export default Plan;
