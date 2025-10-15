import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm   rounded-lg cursor-pointer 
                 text-gray-300  "
    >
      {/* ===== Header Section ===== */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-white font-semibold">{item.prompt}</h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {item.type} — {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button
          className="px-4 py-1 rounded-full text-sm font-medium border border-[#5044e5]/30 
                     text-[#c7c8ff] bg-[#5044e5]/10 hover:bg-[#5044e5]/20 transition-all"
        >
          {item.type}
        </button>
      </div>

      {/* ===== Expanded Section ===== */}
      {expanded && (
        <div className="mt-4">
          {item.type === "image" ? (
            <div className="flex justify-center">
              <img
                src={item.content}
                alt="Generated"
                className="mt-3 w-full max-w-md rounded-lg border border-gray-700"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-auto text-sm text-gray-200 leading-relaxed">
              <div className="reset-tw prose prose-invert max-w-none">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
