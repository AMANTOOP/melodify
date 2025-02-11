"use client";

import { useState, useRef, createContext, useContext, useEffect } from "react";

// Create Context
const PlayerContext = createContext();

// Custom Hook to use Player Context
export const usePlayer = () => {
  return useContext(PlayerContext);
};

// Player Provider Component
export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio();

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const playSong = (songData) => {
    if (!audioRef.current) return;

    setCurrentSong(songData); // Store full songData

    if (audioRef.current.src !== songData.url) {
      audioRef.current.src = songData.url;
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !audioRef.current.src) return; // Ensure audio is loaded

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.error("Audio play error:", error));
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    if (!audioRef.current) return; // Ensure audio is initialized
    audioRef.current.currentTime += time;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <PlayerContext.Provider value={{ currentSong, playSong, togglePlayPause, seek, isPlaying, duration, currentTime, isMuted, toggleMute }}>
      {children}
    </PlayerContext.Provider>
  );
};
