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
    if (currentSong) {
      updateMediaSession();
    }
  }, [currentSong, isPlaying, queue]); // Update whenever song changes or play/pause state changes
  
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
  const playSong = async (songData) => {
    if (!audioRef.current) return;

    try {
        // Pause the current song if it's playing
        await audioRef.current.pause();

        // Set the new song source and load it
        audioRef.current.src = songData.url;
        await audioRef.current.load(); // Ensures the song is properly loaded

        // Update state before playing
        setCurrentSong(songData);
        setIsPlaying(true);

        // Play the song after loading
        await audioRef.current.play();
    } catch (error) {
        console.error("Play error:", error);
    }
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
  const addToQueue = async (song) => {

    const isPlaying = () => {
      const audio = document.querySelector("audio"); // Adjust selector if needed
      return audio && !audio.paused; // Returns true if the audio is playing
  };
  
    if (!currentSong) {
        if (isPlaying()) {
            console.log("A song is already playing, skipping play request.");
            return;
        }
        
        try {
            await playSong(song); // Ensure first song plays before anything else
        } catch (error) {
            console.error("Error playing song:", error);
            return;
        }
        return;
    }

    setQueue((prevQueue) => {
        const isAlreadyInQueue = prevQueue.some((queuedSong) => queuedSong.id === song.id);

        if (isAlreadyInQueue || currentSong?.id === song.id) {
            return prevQueue; // Prevent duplicate songs in the queue
        }

        return [...prevQueue, song];
    });

    // Wait a bit for state update before checking queue
    await new Promise((resolve) => setTimeout(resolve, 100));

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

  const updateMediaSession = () => {
    if (!("mediaSession" in navigator) || !currentSong) return;
  
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong?.name || "Unknown",
      artist: currentSong?.primaryArtists || "Unknown",
      artwork: [
        { src: currentSong?.image || "/default-cover.jpg", sizes: "512x512", type: "image/jpg" }
      ]
    });
  
    // Set media controls to sync with your app
    navigator.mediaSession.setActionHandler("play", () => {
      togglePlayPause();
    });
  
    navigator.mediaSession.setActionHandler("pause", () => {
      togglePlayPause();
    });
    
    if(queue.length > 0){
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      playNext();
    });
  }
  
    // If you plan to support previous track functionality, implement it
    // navigator.mediaSession.setActionHandler("previoustrack", playPrevious);
  };
  
  

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        playSong,
        togglePlayPause,
        seek,
        isPlaying,
        setIsPlaying,
        duration,
        currentTime,
        isMuted,
        toggleMute,
        addToQueue,
        playNext,
        removeFromQueue,
        queue,
        setQueue,
        removeFromQueueWithId,
        updateMediaSession,

      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
