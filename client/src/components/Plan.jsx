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
    Feed Your <span className="text-primary">Wizard</span>
  </h2>
  <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
    Nourish Vidi with the magic he deserves — start free and empower him with 
    greater spells as you grow. Feed your wizard to unlock his full potential.
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
