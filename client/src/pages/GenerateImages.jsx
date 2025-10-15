import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import sky from "../assets/sky.png";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) setContent(data.content);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="h-full overflow-y-auto p-0 text-gray-200"
      style={{
        backgroundImage: `url(${sky})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-screen bg-[#0f172a]/40 backdrop-blur-md p-4 sm:p-6 rounded-lg flex flex-wrap gap-6 justify-center">

        {/* Left Column */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-5  bg-gray-400/10 backdrop-blur-md  rounded-xl 
                     transition-all duration-300 
                     min-h-[350px] max-h-[450px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-6 text-purple-300" />
              <h1 className="text-lg font-semibold text-white">AI Image Generator</h1>
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe Your Image
            </label>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              rows={4}
              className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                         text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400"
              placeholder="Describe what you want to see in the image..."
              required
            />

            <label className="block text-sm font-medium text-gray-300 mt-5 mb-2">Style</label>
            <div className="flex flex-wrap gap-2">
              {imageStyle.map((item) => (
                <span
                  key={item}
                  onClick={() => setSelectedStyle(item)}
                  className={`px-4 py-1 text-xs border rounded-full cursor-pointer transition-all duration-200 
                  ${
                    selectedStyle === item
                      ? "bg-purple-500/20 border-purple-400 text-purple-300"
                      : "text-gray-400 border-gray-600 hover:border-purple-400 hover:text-purple-300"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="my-6 flex items-center gap-2">
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => setPublish(e.target.checked)}
                  checked={publish}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 rounded-full peer-checked:bg-purple-500 transition"></div>
                <span
                  className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full 
                  transition peer-checked:translate-x-4"
                ></span>
              </label>
              <p className="text-sm text-gray-400">Make this image Public</p>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-purple-500 to-purple-700 text-white 
                       px-4 py-2 mt-2 text-sm rounded-lg transition-all duration-200 
                       hover:from-purple-400 hover:to-purple-600 active:shadow-[0_0_12px_#a855f7] 
                       disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
            ) : (
              <Image className="w-5" />
            )}
            Generate Image
          </button>
        </form>

        {/* Right Column */}
        <div
          className="w-full max-w-lg p-5 bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-5 h-5 text-purple-300" />
            <h1 className="text-lg font-semibold text-white">Generated Image</h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <Image className="w-8 h-8 text-gray-500" />
                <p>Enter a topic and click “Generate Image” to get started.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center overflow-y-auto">
              <img
                src={content}
                alt="Generated"
                className="mt-3 w-full rounded-lg object-contain border border-gray-700 shadow-md"
              />
              <a
                href={content}
                download="generated_image.png"
                className="mt-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white 
                           px-4 py-2 rounded-lg text-sm transition-all duration-200 
                           hover:from-purple-400 hover:to-purple-600"
              >
                Download Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
