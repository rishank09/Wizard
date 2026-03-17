import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { QrCode, Download, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import sky from '../assets/sky.png'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const QRCodeGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [text, setText] = useState('')
  const [size, setSize] = useState('300')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#FFFFFF')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setQrCode(null)
    
    try {
      const { data } = await axios.post(
        '/api/qrcode/generate',
        { 
          text,
          size: parseInt(size),
          color: {
            dark: darkColor,
            light: lightColor
          }
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setQrCode(data)
        toast.success('QR code generated successfully!')
        setText('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCode) return
    
    const link = document.createElement('a')
    link.href = qrCode.qrCodeImage
    link.download = `qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                     min-h-[500px] max-h-[500px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <QrCode className="w-6 text-green-300" />
              <h1 className="text-lg font-semibold text-white">QR Code Generator</h1>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Text or URL
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="3"
                  placeholder="Enter text, URL, or any data to encode..."
                  className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                           text-sm text-white placeholder-gray-400 outline-none focus:border-green-400"
                  required
                  maxLength={2000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Size (pixels)
                </label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  min="100"
                  max="1000"
                  placeholder="300"
                  className="w-full p-2.5 bg-transparent border border-gray-600 rounded-md 
                           text-sm text-white placeholder-gray-400 outline-none focus:border-green-400"
                />
              </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex items-center mb-4">
                <Palette className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-300">Color Options</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Foreground Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="h-10 w-16 border border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 bg-transparent border border-gray-600 rounded-md 
                               text-sm text-white placeholder-gray-400 outline-none focus:border-green-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="h-10 w-16 border border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1 px-3 py-2 bg-transparent border border-gray-600 rounded-md 
                               text-sm text-white placeholder-gray-400 outline-none focus:border-green-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 
                       bg-gradient-to-r from-green-500 to-green-700 text-white 
                       px-4 py-2 mt-4 text-sm rounded-lg transition-all duration-200 
                       hover:from-green-400 hover:to-green-600 active:shadow-[0_0_12px_#059669] disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin border-white"></span>
            ) : (
              <QrCode className="w-5" />
            )}
            Generate QR Code
          </button>
        </form>

        {/* Right Column */}
        <div
          className="w-full max-w-lg p-5 bg-gray-400/10 backdrop-blur-md hover:bg-gray-800 rounded-xl 
                     transition-all duration-300 
                     flex flex-col min-h-[400px] max-h-[600px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <QrCode className="w-5 h-5 text-green-300" />
            <h1 className="text-lg font-semibold text-white">Generated QR Code</h1>
          </div>

          {!qrCode ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
                <QrCode className="w-8 h-8 text-gray-500" />
                <p>Enter text and click "Generate QR Code" to get started.</p>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-md">
                <img 
                  src={qrCode.qrCodeImage} 
                  alt="Generated QR Code" 
                  className="max-w-full h-auto"
                  style={{ width: `${qrCode.size}px`, height: `${qrCode.size}px` }}
                />
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                <p>Size: {qrCode.size}x{qrCode.size}px</p>
                <p>Text: {qrCode.text}</p>
              </div>

              <button
                onClick={downloadQRCode}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator
