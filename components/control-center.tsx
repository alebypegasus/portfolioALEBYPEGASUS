"use client"

import { useState, useEffect } from "react"
import { Wifi, Bluetooth, Moon, Sun, Volume2, VolumeX, Maximize } from "lucide-react"

interface ControlCenterProps {
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  brightness: number
  onBrightnessChange: (value: number) => void
}

export default function ControlCenter({
  onClose,
  isDarkMode,
  onToggleDarkMode,
  brightness,
  onBrightnessChange,
}: ControlCenterProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [volume, setVolume] = useState(75)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Load WiFi state from localStorage
  useEffect(() => {
    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    // Check if we're in fullscreen mode
    setIsFullscreen(!!document.fullscreenElement)

    // Add fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Update the Control Center to store WiFi state in localStorage
  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <div
      className="fixed top-8 right-4 w-80 bg-gray-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl z-40"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              wifiEnabled ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={toggleWifi}
          >
            <Wifi className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs">Wi-Fi</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              bluetoothEnabled ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          >
            <Bluetooth className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs">Bluetooth</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              isDarkMode ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={onToggleDarkMode}
          >
            {isDarkMode ? <Moon className="w-6 h-6 text-white mb-1" /> : <Sun className="w-6 h-6 text-white mb-1" />}
            <span className="text-white text-xs">{isDarkMode ? "Dark" : "Light"}</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              isFullscreen ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={toggleFullscreen}
          >
            <Maximize className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
        </div>

        <div className="bg-gray-700 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Display</span>
            <span className="text-white text-sm">{brightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number.parseInt(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-gray-700 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Volume</span>
            <span className="text-white text-sm">{volume}%</span>
          </div>
          <div className="flex items-center">
            {volume === 0 ? (
              <VolumeX className="w-5 h-5 text-white mr-2" />
            ) : (
              <Volume2 className="w-5 h-5 text-white mr-2" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number.parseInt(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
