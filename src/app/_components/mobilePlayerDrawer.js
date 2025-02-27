"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { usePlayer } from "@/hooks/usePlayer";
import { Slider } from "@/components/ui/slider";
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  CircleMinus,
} from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { AddToPlaylistDialog } from "./addToPlaylistDialog";
import AuthContext from "@/context/authContext"; // Import custom hook

export default function MobilePlayerDrawer({ isDrawerOpen, setIsDrawerOpen }) {
  const {
    currentSong,
    togglePlayPause,
    seek,
    isPlaying,
    isMuted,
    toggleMute,
    playNext,
    queue,
    playSong,
    removeFromQueueWithId,
    currentTime,
    duration,
  } = usePlayer();
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent className="p-4 bg-neutral-900 text-white flex flex-col h-full">
        {/* 🔹 Header */}
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Now Playing</DrawerTitle>
          <DrawerClose
            className="text-gray-400 hover:text-white"
            onClick={() => setIsDrawerOpen(false)}
          />
        </DrawerHeader>

        {/* 🔹 Now Playing Section */}
        <div className="flex flex-col items-center space-y-3 p-6">
          <Image
            src={currentSong?.image || "/placeholder.svg"}
            alt={currentSong?.name || "Album cover"}
            width={150}
            height={150}
            className="rounded-lg"
          />
          <h3 className="text-lg font-semibold">
            {currentSong?.name || "No song playing"}
          </h3>
          <h2 className="text-sm font-semibold mt-0">
            {
              currentSong?.primaryArtists
              ?.split(",") // Split if it's a comma-separated string
              .slice(0, 2) // Take only the first 5 artists
              .join(", ")
            }
          </h2>

          <div className="flex items-center justify-between w-full">
            {/* 🎶 Controls (Left-aligned) */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => seek(-10)}
                className="transition-transform duration-150 ease-in-out active:scale-90 active:shadow-inner hover:scale-105 hover:shadow-lg"
              >
                <Image
                  src="https://img.icons8.com/?size=100&id=52193&format=png&color=FFFFFF"
                  width={20}
                  height={20}
                  alt="-10s back"
                />
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
                className="transition-transform duration-150 ease-in-out active:scale-90 active:shadow-inner hover:scale-105 hover:shadow-lg"
              >
                <Image
                  src="https://img.icons8.com/?size=100&id=52187&format=png&color=FFFFFF"
                  width={20}
                  height={20}
                  alt="+10s forward"
                />
              </button>
            </div>

            {/* 🔊 Volume & Next Song (Right-aligned) */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-white"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <button
                onClick={playNext}
                className="transition-transform duration-150 ease-in-out active:scale-90 active:shadow-inner hover:scale-105 hover:shadow-lg"
              >
                <SkipForward size={20} />
              </button>
              <button
                className="transition-transform duration-150 ease-in-out active:scale-90 active:shadow-inner hover:scale-105 hover:shadow-lg bg-black text-black"
              >
                {(isLoggedIn && currentSong) && <AddToPlaylistDialog songId={currentSong.id} />}
              </button>
              
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
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
        {/* 📜 Queue Section */}
        <div className="mt-6 bg-neutral-800 p-3 rounded-lg max-h-60 overflow-y-auto">
          <h4 className="font-semibold text-center mb-2">Queue</h4>
          {queue.length === 0 ? (
            <p className="text-gray-400 text-center">Queue is empty</p>
          ) : (
            <ul className="space-y-2">
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-neutral-700"
                >
                  <div
                    className="flex items-center space-x-2 flex-grow cursor-pointer"
                    onClick={() => {
                      playSong(song);
                      removeFromQueueWithId(song.id);
                    }}
                  >
                    <Image
                      src={song.image || "/placeholder.svg"}
                      alt={song.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-sm">{song.name}</p>
                      <p className="text-xs text-gray-400">
                        {song.primaryArtists}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromQueueWithId(song.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <CircleMinus size={20} />
                  </button>
                </div>
              ))}
            </ul>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
