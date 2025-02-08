"use client"

import { useState, useEffect, useRef } from "react"

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio()
  }, [])

  const setAudioSrc = (src) => {
    if (audioRef.current) {
      audioRef.current.src = src
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return { isPlaying, togglePlayPause, setAudioSrc }
}

