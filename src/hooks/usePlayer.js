"use client";

import { useState, useRef, createContext, useContext, useEffect } from "react";
import toast from "react-hot-toast";

// Create Context
const PlayerContext = createContext();

// Custom Hook to use Player Context
export const usePlayer = () => {
  return useContext(PlayerContext);
};

// Player Provider Component
export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // Stores queued songs
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const handleEnded = () => {
      playNext(); // 🔥 When song ends, play next from queue
    };

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleEnded); // 🚀 Auto play next

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  // Play a Song
  const playSong = (songData) => {
    if (!audioRef.current) return;

    setCurrentSong(songData); // Store song data
    audioRef.current.src = songData.url;
    audioRef.current.play().catch((error) => console.error("Play error:", error));
    setIsPlaying(true);
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.error("Audio play error:", error));
    }
    setIsPlaying(!isPlaying);
  };

  // Seek (Forward / Backward)
  const seek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += time;
  };

  // Toggle Mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  // ✅ Add Song to Queue
  const addToQueue = (song) => {
    if (!currentSong) {
      playSong(song);
      return;
    }
  
    setQueue((prevQueue) => {
      const isAlreadyInQueue = prevQueue.some((queuedSong) => queuedSong.id === song.id);
  
      if (isAlreadyInQueue || currentSong?.id === song.id) {
        return prevQueue; // Do not modify queue if song already exists
      }
  
      return [...prevQueue, song]; // Add song if it's not in queue
    });
  
    // Show toast outside setQueue to ensure it triggers only once
    if (currentSong?.id === song.id || queue.some((s) => s.id === song.id)) {
      toast.error("Song is already in the queue!");
    } else {
      toast.success("Song added to queue!");
    }
  };
  
  

  // ✅ Play Next Song from Queue
  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue((prevQueue) => prevQueue.slice(1));
      playSong(nextSong); // 🎵 Play the next song
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  // ✅ Remove Song from Queue
  const removeFromQueue = (index) => {
    setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index));
  };

  const removeFromQueueWithId = (songId) => {
    setQueue((prevQueue) => prevQueue.filter((song) => song.id !== songId));
  };
  

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        playSong,
        togglePlayPause,
        seek,
        isPlaying,
        duration,
        currentTime,
        isMuted,
        toggleMute,
        addToQueue,
        playNext,
        removeFromQueue,
        queue,
        removeFromQueueWithId,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
