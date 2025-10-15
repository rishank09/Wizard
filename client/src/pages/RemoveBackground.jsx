import React, { useState } from "react";
import axios from "axios";
import { Image, Upload } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import sky from "../assets/sky.png";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.post("/api/ai/remove-bg", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setOutputUrl(data.image);
      } else toast.error(data.message);
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

        {/* Left Column - Upload Section */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-5  bg-gray-400/10 backdrop-blur-md  rounded-xl 
                     transition-all duration-300 
                     min-h-[350px] max-h-[350px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Upload className="w-6 text-purple-300" />
              <h1 className="text-lg font-semibold text-white">Upload Image</h1>
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select an image to remove background
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 border border-gray-600 
                         rounded-md cursor-pointer bg-transparent 
                         focus:border-purple-400 focus:text-white file:mr-4 
                         file:py-2 file:px-4 file:rounded-md 
                         file:border-0 file:text-sm file:font-semibold 
                         file:bg-purple-600 file:text-white 
                         hover:file:bg-purple-500"
            />

            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-600 shadow-md"
                />
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-purple-500 to-purple-700 text-white 
                       px-4 py-2 mt-6 text-sm rounded-lg transition-all duration-200 
                       hover:from-purple-400 hover:to-purple-600 active:shadow-[0_0_12px_#a855f7] 
                       disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
            ) : (
              <Upload className="w-5" />
            )}
            Remove Background
          </button>
        </form>

        {/* Right Column - Output Section */}
        <div
          className="w-full max-w-lg p-5  bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-5 h-5 text-purple-300" />
            <h1 className="text-lg font-semibold text-white">Processed Image</h1>
          </div>

          {!outputUrl ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <Image className="w-8 h-8 text-gray-500" />
                <p>Upload an image and click “Remove Background” to begin.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center overflow-y-auto">
              <img
                src={outputUrl}
                alt="Result"
                className="rounded-lg border border-gray-700 shadow-lg"
              />
              <a
                href={outputUrl}
                download="background_removed.png"
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

export default RemoveBackground;
