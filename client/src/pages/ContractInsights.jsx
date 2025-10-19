import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import sky from '../assets/sky.png';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ContractInsights = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post('/api/ai/contract-insights', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen bg-[#0f172a]/40 backdrop-blur-md p-4 sm:p-6 rounded-lg flex flex-wrap gap-6 justify-center">

        {/* Left Column */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-5  bg-gray-400/10 backdrop-blur-md rounded-xl 
                     transition-all duration-300 
                     min-h-[350px] max-h-[350px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-6 text-purple-300" />
              <h1 className="text-lg font-semibold text-white">Contract Insights</h1>
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Your Contract 
            </label>
            <input
              onChange={(e) => setInput(e.target.files[0])}
              type="file"
              accept="application/pdf"
              className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                         text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Supports PDF contract only.</p>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-purple-500 to-purple-700 text-white 
                       px-4 py-2 mt-6 text-sm rounded-lg transition-all duration-200 
                       hover:from-purple-400 hover:to-purple-600 active:shadow-[0_0_12px_#a855f7] disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
            ) : (
              <FileText className="w-5" />
            )}
            Contract Insights
          </button>
        </form>

        {/* Right Column */}
        <div
          className="w-full max-w-lg p-5  bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-purple-300" />
            <h1 className="text-lg font-semibold text-white">Analysis Results</h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <FileText className="w-8 h-8 text-gray-500" />
                <p>Upload your contract and click “Analyze Contract” to get started.</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 overflow-y-auto text-sm text-gray-200 leading-relaxed prose prose-invert prose-purple max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractInsights;
