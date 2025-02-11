"use client";

import { usePlayer } from "@/hooks/usePlayer";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  PlayCircle,
  PauseCircle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";

const GlobalPlayer = () => {
  const {
    currentSong,
    togglePlayPause,
    seek,
    isPlaying,
    duration,
    currentTime,
    isMuted,
    toggleMute,
  } = usePlayer();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-900 text-white p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Mobile View: Only Image, Title & Controls */}
        <div className="flex items-center w-full md:hidden">
          <Image
            src={currentSong?.image || "/vercel.svg"}
            alt={currentSong?.name || "Album cover"}
            width={48}
            height={48}
            className="rounded-md"
          />
          <h3 className="text-sm font-semibold flex-1 ml-3 truncate">
            {currentSong?.name || "Say it to play it!"}
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => seek(-10)}
              className="text-gray-400 hover:text-white"
            >
              <div className="group">
                <Image
                  src="https://img.icons8.com/?size=100&id=52193&format=png&color=FFFFFF"
                  width={20}
                  height={20}
                  alt="-10s back"
                  className="cursor-pointer transition-colors duration-200 group-active:invert"
                />
              </div>
            </button>
            <button
              onClick={togglePlayPause}
              className="text-white hover:scale-110 transition"
            >
              {isPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
            </button>
            <button
              onClick={() => seek(10)}
              className="text-gray-400 hover:text-white"
            >
              <div className="group">
                <Image
                  src="https://img.icons8.com/?size=100&id=52187&format=png&color=FFFFFF"
                  width={20}
                  height={20}
                  alt="+10s forward"
                  className="cursor-pointer transition-colors duration-200 group-active:invert"
                />
              </div>
            </button>
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        {/* PC View: Full UI */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Image
              src={currentSong?.image || "/placeholder.svg"}
              alt={currentSong?.name || "Album cover"}
              width={56}
              height={56}
              className="rounded-md "
            />
            <div>
              <h3 className="font-semibold">
                {currentSong?.name || "No song playing"}
              </h3>
              <p className="text-sm text-gray-400">
                {currentSong?.primaryArtists || "Unknown artist"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 flex-grow max-w-md mx-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => seek(-10)}
                className="text-gray-400 hover:text-white"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlayPause}
                className="text-white hover:scale-110 transition"
              >
                {isPlaying ? (
                  <PauseCircle size={40} />
                ) : (
                  <PlayCircle size={40} />
                )}
              </button>
              <button
                onClick={() => seek(10)}
                className="text-gray-400 hover:text-white"
              >
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full flex items-center space-x-2">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <Slider
                value={[(currentTime / duration) * 100]}
                max={100}
                step={1}
                className="flex-grow"
                onValueChange={(value) => {
                  if (duration) {
                    seek((value[0] / 100) * duration - currentTime);
                  }
                }}
              />
              <span className="text-xs">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 size={20} />
            <Slider defaultValue={[100]} max={100} step={1} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPlayer;
