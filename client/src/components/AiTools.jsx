import { useUser } from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiToolsData } from "../assets/assets";
import WizardBackground from "./WizardBackground";

const AiTools = () => {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <div className="relative px-4 sm:px-20 xl:px-32 my-24 py-24 rounded-3xl text-gray-100 overflow-hidden">
      {/* Background */}
      <WizardBackground />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-[38px] sm:text-[42px] font-semibold text-gray-100">
          Powerful <span className="text-primary">AI Tools</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto mt-3">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="relative z-10 flex flex-wrap mt-12 justify-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="group p-8 m-4 max-w-xs rounded-xl bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 shadow-lg shadow-purple-900/10
              hover:-translate-y-1 transition-all duration-300 cursor-pointer "
            onClick={() => user && navigate(tool.path)}
          >
            <tool.Icon
              className="w-12 h-12 p-3 text-white rounded-xl transition-all duration-300 group-hover:shadow-glow"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />
            <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-100">
              {tool.title}
            </h3>
            <p className="text-gray-400 text-sm max-w-[95%] leading-relaxed">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
