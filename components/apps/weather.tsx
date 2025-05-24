"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Thermometer, Droplets, Wind, Sunrise, Sunset, Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WeatherProps {
  isDarkMode?: boolean
}

// Mock weather data for different cities
const weatherData = {
  "New York": {
    current: {
      temp: 18,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      sunrise: "6:15 AM",
      sunset: "7:45 PM",
      feelsLike: 17,
    },
    forecast: [
      { day: "Mon", temp: 19, condition: "sunny" },
      { day: "Tue", temp: 21, condition: "partly-cloudy" },
      { day: "Wed", temp: 17, condition: "rainy" },
      { day: "Thu", temp: 15, condition: "rainy" },
      { day: "Fri", temp: 14, condition: "snowy" },
    ],
  },
  "London": {
    current: {
      temp: 14,
      condition: "Rainy",
      humidity: 80,
      windSpeed: 18,
      sunrise: "5:45 AM",
      sunset: "8:30 PM",
      feelsLike: 12,
    },
    forecast: [
      { day: "Mon", temp: 13, condition: "rainy" },
      { day: "Tue", temp: 14, condition: "rainy" },
      { day: "Wed", temp: 15, condition: "partly-cloudy" },
      { day: "Thu", temp: 16, condition: "partly-cloudy" },
      { day: "Fri", temp: 14, condition: "rainy" },
    ],
  },
  "Tokyo": {
    current: {
      temp: 24,
      condition: "Sunny",
      humidity: 50,
      windSpeed: 8,
      sunrise: "4:30 AM",
      sunset: "6:45 PM",
      feelsLike: 25,
    },
    forecast: [
      { day: "Mon", temp: 25, condition: "sunny" },
      { day: "Tue", temp: 26, condition: "sunny" },
      { day: "Wed", temp: 24, condition: "partly-cloudy" },
      { day: "Thu", temp: 23, condition: "partly-cloudy" },
      { day: "Fri", temp: 25, condition: "sunny" },
    ],
  },
  "Sydney": {
    current: {
      temp: 22,
      condition: "Sunny",
      humidity: 55,
      windSpeed: 15,
      sunrise: "6:30 AM",
      sunset: "5:15 PM",
      feelsLike: 23,
    },
    forecast: [
      { day: "Mon", temp: 23, condition: "sunny" },
      { day: "Tue", temp: 25, condition: "sunny" },
      { day: "Wed", temp: 21, condition: "partly-cloudy" },
      { day: "Thu", temp: 19, condition: "rainy" },
      { day: "Fri", temp: 20, condition: "partly-cloudy" },
    ],
  },
  "Paris": {
    current: {
      temp: 16,
      condition: "Partly Cloudy",
      humidity: 60,
      windSpeed: 10,
      sunrise: "6:00 AM",
      sunset: "8:15 PM",
      feelsLike: 15,
    },
    forecast: [
      { day: "Mon", temp: 17, condition: "partly-cloudy" },
      { day: "Tue", temp: 18, condition: "partly-cloudy" },
      { day: "Wed", temp: 16, condition: "rainy" },
      { day: "Thu", temp: 15, condition: "rainy" },
      { day: "Fri", temp: 17, condition: "partly-cloudy" },
    ],
  },
}

type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "snowy"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export default function Weather({ isDarkMode = true }: WeatherProps) {
  const [city, setCity] = useState("New York")
  const [searchQuery, setSearchQuery] = useState("")
  const [weather, setWeather] = useState(weatherData["New York"])
  const [condition, setCondition] = useState<WeatherCondition>("partly-cloudy")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-100"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  
  // Initialize particles and animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Initialize particles based on condition
    initParticles()
    
    // Start animation
    const animate = () => {
      if (!canvas || !ctx) return
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      updateParticles(ctx, canvas.width, canvas.height)
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [condition])
  
  // Update weather condition when city changes
  useEffect(() => {
    if (weatherData[city]) {
      setWeather(weatherData[city])
      
      // Set condition based on current weather
      const currentCondition = weatherData[city].current.condition.toLowerCase()
      if (currentCondition.includes("rain")) {
        setCondition("rainy")
      } else if (currentCondition.includes("snow")) {
        setCondition("snowy")
      } else if (currentCondition.includes("cloud")) {
        setCondition("partly-cloudy")
      } else if (currentCondition.includes("sun")) {
        setCondition("sunny")
      } else {
        setCondition("partly-cloudy")
      }
      
      // Reinitialize particles
      initParticles()
    }
  }, [city])
  
  const initParticles = () => {
    particles.current = []
    
    const count = condition === "rainy" ? 100 : 
                  condition === "snowy" ? 80 : 
                  condition === "sunny" ? 50 : 30
    
    for (let i = 0; i < count; i++) {
      let particle: Particle
      
      if (condition === "rainy") {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 7 + 10,
          opacity: Math.random() * 0.5 + 0.5,
          color: isDarkMode ? 'rgba(120, 160, 255, 0.8)' : 'rgba(0, 90, 190, 0.6)'
        }
      } else if (condition === "snowy") {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 2,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 + 1,
          opacity: Math.random() * 0.3 + 0.7,
          color: 'rgba(255, 255, 255, 0.8)'
        }
      } else if (condition === "sunny") {
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          color: isDarkMode ? 
            `rgba(${255}, ${200 + Math.random() * 55}, ${0}, ${Math.random() * 0.5 + 0.3})` : 
            `rgba(${255}, ${200 + Math.random() * 55}, ${0}, ${Math.random() * 0.7 + 0.3})`
        }
      } else {
        // Clouds
        particle = {
          x: Math.random() * 100,
          y: Math.random() * 30,
          size: Math.random() * 30 + 20,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: 0,
          opacity: Math.random() * 0.2 + 0.1,
          color: isDarkMode ? 'rgba(200, 200, 220, 0.3)' : 'rgba(255, 255, 255, 0.7)'
        }
      }
      
      particles.current.push(particle)
    }
  }
  
  const updateParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    particles.current.forEach(p => {
      // Convert percentage to actual position
      const x = (p.x / 100) * width
      const y = (p.y / 100) * height
      
      // Draw particle
      ctx.beginPath()
      
      if (condition === "rainy") {
        // Draw raindrops
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size / 2
        ctx.moveTo(x, y)
        ctx.lineTo(x + p.speedX, y + p.size * 2)
        ctx.stroke()
      } else if (condition === "snowy") {
        // Draw snowflakes
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (condition === "sunny") {
        // Draw sun particles
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Draw clouds
        ctx.fillStyle = p.color
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Update position
      p.x += p.speedX * 0.1
      p.y += p.speedY * 0.1
      
      // Reset position if out of bounds
      if (condition === "rainy") {
        if (p.y > 100) {
          p.y = 0
          p.x = Math.random() * 100
        }
        if (p.x < 0 || p.x > 100) {
          p.x = Math.random() * 100
        }
      } else if (condition === "snowy") {
        if (p.y > 100) {
          p.y = 0
          p.x = Math.random() * 100
        }
        if (p.x < 0 || p.x > 100) {
          p.x = Math.random() * 100
        }
      } else if (condition === "sunny") {
        // Keep sun particles within bounds
        if (p.x < 0) p.x = 100
        if (p.x > 100) p.x = 0
        if (p.y < 0) p.y = 100
        if (p.y > 100) p.y = 0
      } else {
        // Cloud movement
        if (p.x < -30) p.x = 130
        if (p.x > 130) p.x = -30
      }
    })
  }
  
  const handleSearch = () => {
    const query = searchQuery.trim()
    if (query && Object.keys(weatherData).some(city => city.toLowerCase().includes(query.toLowerCase()))) {
      const foundCity = Object.keys(weatherData).find(city => 
        city.toLowerCase().includes(query.toLowerCase())
      )
      if (foundCity) {
        setCity(foundCity)
      }
    }
    setSearchQuery("")
  }
  
  const getWeatherIcon = (condition: string) => {
    if (condition.includes("sunny")) return <Sun className="w-6 h-6" />
    if (condition.includes("partly-cloudy")) return <Cloud className="w-6 h-6" />
    if (condition.includes("rainy")) return <CloudRain className="w-6 h-6" />
    if (condition.includes("snowy")) return <CloudSnow className="w-6 h-6" />
    return <Cloud className="w-6 h-6" />
  }
  
  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col relative overflow-hidden`}>
      {/* Canvas for weather effects */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0"
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Search bar */}
        <div className="p-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button 
            onClick={handleSearch}
            variant={isDarkMode ? "outline" : "default"}
            className={isDarkMode ? "border-gray-700" : ""}
          >
            Search
          </Button>
        </div>
        
        {/* Current weather */}
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <h2 className="text-2xl font-bold">{city}</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">Today</p>
            
            <div className="flex items-center mt-4">
              <div className="text-6xl font-light mr-4">{weather.current.temp}°</div>
              <div>
                <p className="text-lg">{weather.current.condition}</p>
                <p className="text-sm text-gray-500">Feels like {weather.current.feelsLike}°</p>
              </div>
            </div>
          </div>
          
          <div className={`${cardBg} p-4 rounded-lg border ${borderColor} grid grid-cols-2 gap-4 w-full md:w-auto`}>
            <div className="flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-medium">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wind className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Wind</p>
                <p className="font-medium">{weather.current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center">
              <Sunrise className="w-5 h-5 mr-2 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Sunrise</p>
                <p className="font-medium">{weather.current.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Sunset className="w-5 h-5 mr-2 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Sunset</p>
                <p className="font-medium">{weather.current.sunset}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Forecast */}
        <div className="px-6 mt-4">
          <h3 className="text-lg font-medium mb-3">5-Day Forecast</h3>
          <div className={`grid grid-cols-5 gap-2 ${cardBg} rounded-lg border ${borderColor} p-4`}>
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="font-medium">{day.day}</p>
                <div className="my-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className="text-lg font-medium">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* City selector */}
        <div className="px-6 mt-6">
          <h3 className="text-lg font-medium mb-3">Popular Cities</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(weatherData).map((cityName) => (
              <Button
                key={cityName}
                variant={city === cityName ? "default" : "outline"}
                className={`${city === cityName ? "" : isDarkMode ? "border-gray-700" : "border-gray-300"}`}
                onClick={() => setCity(cityName)}
              >
                {cityName}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
