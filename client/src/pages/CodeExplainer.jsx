import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Code, Lightbulb, Zap, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import sky from '../assets/sky.png'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const CodeExplainer = () => {
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('')
  const { getToken } = useAuth()

  const languages = [
    'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 
    'php', 'ruby', 'go', 'rust', 'typescript', 'swift', 
    'kotlin', 'scala', 'r', 'sql', 'html', 'css', 'bash'
  ]

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setExplanation(null)
    
    try {
      const { data } = await axios.post(
        '/api/code/explain',
        { code, language },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setExplanation(data)
        toast.success('Code explained successfully!')
        setCode('')
        setLanguage('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to explain code')
    } finally {
      setLoading(false)
    }
  }

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
          className="w-full max-w-lg p-5 bg-gray-400/10 backdrop-blur-md rounded-xl 
                     transition-all duration-300 
                     min-h-[450px] max-h-[450px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Code className="w-6 text-purple-300" />
              <h1 className="text-lg font-semibold text-white">Code Explainer</h1>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                           text-sm text-white outline-none focus:border-purple-400"
                  required
                >
                  <option value="">Select a language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows="8"
                  placeholder="Paste your code here..."
                  className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                           text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400 font-mono"
                  required
                  maxLength={10000}
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-purple-500 to-purple-700 text-white 
                       px-4 py-2 mt-4 text-sm rounded-lg transition-all duration-200 
                       hover:from-purple-400 hover:to-purple-600 active:shadow-[0_0_12px_#a855f7] disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
            ) : (
              <Code className="w-5" />
            )}
            Explain Code
          </button>
        </form>

        {/* Right Column */}
        <div
          className="w-full max-w-lg p-5 bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-5 h-5 text-purple-300" />
            <h1 className="text-lg font-semibold text-white">Code Analysis</h1>
          </div>

          {!explanation ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <Code className="w-8 h-8 text-gray-500" />
                <p>Enter code and select a language to get started.</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-4 overflow-y-auto text-sm text-gray-200">
              <div className="p-4 bg-blue-400/10 rounded-lg">
                <div className="flex items-center mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-300 mr-2" />
                  <h2 className="text-lg font-semibold text-white">Explanation</h2>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {explanation.explanation}
                </div>
              </div>

              <div className="p-4 bg-green-400/10 rounded-lg">
                <div className="flex items-center mb-3">
                  <Zap className="w-5 h-5 text-green-300 mr-2" />
                  <h2 className="text-lg font-semibold text-white">Complexity Analysis</h2>
                </div>
                <p className="leading-relaxed">{explanation.complexity}</p>
              </div>

              {explanation.improvements && explanation.improvements.length > 0 && (
                <div className="p-4 bg-yellow-400/10 rounded-lg">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-yellow-300 mr-2" />
                    <h2 className="text-lg font-semibold text-white">Improvements</h2>
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    {explanation.improvements.map((improvement, index) => (
                      <li key={index} className="leading-relaxed">{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {explanation.optimized_code && (
                <div className="p-4 bg-purple-400/10 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Code className="w-5 h-5 text-purple-300 mr-2" />
                    <h2 className="text-lg font-semibold text-white">Optimized Code</h2>
                  </div>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto">
                    <code className="text-xs">{explanation.optimized_code}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeExplainer
