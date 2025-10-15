import { useAuth } from '@clerk/clerk-react';
import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Markdown from 'react-markdown';
import sky from '../assets/sky.png';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;
      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen bg-[#0f172a]/40 backdrop-blur-md p-4 sm:p-6 rounded-lg flex flex-wrap gap-6 justify-center">

        {/* Left Column */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-5 bg-gray-400/10 backdrop-blur-md   rounded-xl 
                     transition-all duration-300 
                     min-h-[350px] max-h-[350px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-6 text-purple-300" />
              <h1 className="text-lg font-semibold text-white">AI Title Generator</h1>
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">Keyword</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                         text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400"
              placeholder="The future of Artificial Intelligence is ..."
              required
            />

            <label className="block text-sm font-medium text-gray-300 mt-5 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((item) => (
                <span
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  className={`px-4 py-1 text-xs border rounded-full cursor-pointer transition-all duration-200 
                    ${
                      selectedCategory === item
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'text-gray-400 border-gray-600 hover:border-purple-400 hover:text-purple-300'
                    }`}
                >
                  {item}
                </span>
              ))}
            </div>
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
              <Hash className="w-5" />
            )}
            Generate Title
          </button>
        </form>

        {/* Right Column */}
        <div
          className="w-full max-w-lg p-5  bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Hash className="w-5 h-5 text-purple-300" />
            <h1 className="text-lg font-semibold text-white">Generated Titles</h1>
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <Hash className="w-8 h-8 text-gray-500" />
                <p>Enter a keyword and click “Generate Title” to get started.</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 overflow-y-auto text-sm text-gray-200 leading-relaxed prose prose-invert prose-purple max-w-none">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
