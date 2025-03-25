"use client"

import { useState, useEffect } from "react"
import BootScreen from "@/components/boot-screen"
import LoginScreen from "@/components/login-screen"
import Desktop from "@/components/desktop"
import SleepScreen from "@/components/sleep-screen"
import ShutdownScreen from "@/components/shutdown-screen"

type SystemState = "booting" | "login" | "desktop" | "sleeping" | "shutdown" | "restarting"

export default function Home() {
  const [systemState, setSystemState] = useState<SystemState>("booting")
  const [isDarkMode, setIsDarkMode] = useState(false) // Default to light mode
  const [screenBrightness, setScreenBrightness] = useState(90)

  // Simulate boot sequence
  useEffect(() => {
    if (systemState === "booting") {
      const timer = setTimeout(() => {
        setSystemState("login")
      }, 3000) // 3 seconds boot sequence

      return () => clearTimeout(timer)
    }

    if (systemState === "restarting") {
      // First show boot screen
      const bootTimer = setTimeout(() => {
        setSystemState("login")
      }, 3000) // 3 seconds boot sequence

      return () => clearTimeout(bootTimer)
    }
  }, [systemState])

  // Load settings from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("isDarkMode")
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true")
    }

    const savedBrightness = localStorage.getItem("screenBrightness")
    if (savedBrightness !== null) {
      setScreenBrightness(Number.parseInt(savedBrightness))
    }
  }, [])

  const handleLogin = () => {
    setSystemState("desktop")
  }

  const handleLogout = () => {
    setSystemState("login")
  }

  const handleSleep = () => {
    setSystemState("sleeping")
  }

  const handleWakeUp = () => {
    setSystemState("login")
  }

  const handleShutdown = () => {
    setSystemState("shutdown")
  }

  const handleBoot = () => {
    setSystemState("booting")
  }

  const handleRestart = () => {
    setSystemState("restarting")
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("isDarkMode", newMode.toString())
  }

  const updateBrightness = (value: number) => {
    setScreenBrightness(value)
    localStorage.setItem("screenBrightness", value.toString())
  }

  // Render the appropriate screen based on system state
  const renderScreen = () => {
    switch (systemState) {
      case "booting":
      case "restarting":
        return <BootScreen />

      case "login":
        return <LoginScreen onLogin={handleLogin} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      case "desktop":
        return (
          <Desktop
            onLogout={handleLogout}
            onSleep={handleSleep}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
            initialDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            initialBrightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        )

      case "sleeping":
        return <SleepScreen onWakeUp={handleWakeUp} isDarkMode={isDarkMode} />

      case "shutdown":
        return <ShutdownScreen onBoot={handleBoot} />

      default:
        return <BootScreen />
    }
  }

  return (
    <div className="relative">
      {renderScreen()}

      {/* Brightness overlay - apply to all screens */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  )
}
