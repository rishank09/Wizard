import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Video, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import sky from '../assets/sky.png'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const YouTubeSummarizer = () => {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [videoInfo, setVideoInfo] = useState(null)
  const [input, setInput] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSummary('')
    setVideoInfo(null)
    
    try {
      const { data } = await axios.post(
        '/api/youtube/summarize',
        { videoUrl: input },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setSummary(data.summary)
        setVideoInfo({
          videoId: data.videoId,
          transcriptLength: data.transcriptLength
        })
        toast.success('Video summarized successfully!')
        setInput('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to summarize video')
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
                     min-h-[350px] max-h-[350px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Video className="w-6 text-blue-300" />
              <h1 className="text-lg font-semibold text-white">YouTube Summarizer</h1>
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube Video URL
            </label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                         text-sm text-white placeholder-gray-400 outline-none focus:border-blue-400"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-blue-500 to-blue-700 text-white 
                       px-4 py-2 mt-6 text-sm rounded-lg transition-all duration-200 
                       hover:from-blue-400 hover:to-blue-600 active:shadow-[0_0_12px_#3b82f6] disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
            ) : (
              <Video className="w-5" />
            )}
            Summarize Video
          </button>
        </form>

        {/* Right Column */}
        <div
          className="w-full max-w-lg p-5 bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-green-300" />
            <h1 className="text-lg font-semibold text-white">Video Summary</h1>
          </div>

          {!summary ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <Video className="w-8 h-8 text-gray-500" />
                <p>Enter a YouTube URL and click "Summarize Video" to get started.</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 overflow-y-auto text-sm text-gray-200 leading-relaxed prose prose-invert prose-blue max-w-none">
              {videoInfo && (
                <div className="mb-4 text-xs text-gray-400">
                  <p>Video ID: {videoInfo.videoId}</p>
                  <p>Transcript Length: {videoInfo.transcriptLength} characters</p>
                </div>
              )}
              
              <div className="whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YouTubeSummarizer
