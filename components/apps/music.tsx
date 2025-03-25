"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function Music() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const playlist = [
    {
      title: "Chill Lofi Beat",
      artist: "LoFi Artist",
      cover: "/placeholder.svg?height=300&width=300&query=album cover lofi",
      file: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    },
    {
      title: "Jazz Vibes",
      artist: "Jazz Artist",
      cover: "/placeholder.svg?height=300&width=300&query=album cover jazz",
      file: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946f4a8c41.mp3?filename=jazz-music-7174.mp3",
    },
    {
      title: "Ambient Sounds",
      artist: "Ambient Artist",
      cover: "/placeholder.svg?height=300&width=300&query=album cover ambient",
      file: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8c567b7.mp3?filename=ambient-piano-ampamp-strings-10711.mp3",
    },
  ]

  const currentTrack = playlist[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleNext)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleNext)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
    setIsPlaying(true)
  }

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Music Player</h2>

      <div className="flex flex-col items-center">
        <div className="w-64 h-64 rounded-lg overflow-hidden mb-6">
          <img
            src={currentTrack.cover || "/placeholder.svg"}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
          <p className="text-gray-600">{currentTrack.artist}</p>
        </div>

        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleTimeChange}
            className="mb-4"
          />
        </div>

        <div className="flex items-center justify-center space-x-6 mb-6">
          <button onClick={handlePrevious} className="p-2 rounded-full hover:bg-gray-100">
            <SkipBack className="w-6 h-6" />
          </button>

          <button onClick={togglePlay} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center w-full max-w-xs">
          <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-100 mr-2">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.file} />
    </div>
  )
}
