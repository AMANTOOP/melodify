"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import Image from "next/image";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function SongCard({ song, isExpanded, onExpand }) {
  const { isPlaying, togglePlayPause, setAudioSrc } = useAudioPlayer();

  const handlePlay = (e) => {
    e.stopPropagation(); // Prevents triggering expand when clicking play button
    setAudioSrc(song.url);
    togglePlayPause();
  };

  return (
    <div
      className={`w-full bg-white rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
        isExpanded ? "p-4 space-y-4" : "flex items-center justify-between p-2"
      } md:p-4 md:space-y-4 md:cursor-default`}
      onClick={onExpand}
    >
      {/* Mobile View (Collapsed) */}
      <div className="flex items-center w-full ">
        <h2 className="text-lg font-bold flex-1 truncate">{song.name}</h2>
        <Button onClick={handlePlay} variant="outline" className="ml-2">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>

      {/* Expanded View (Full Card) */}
      {(isExpanded || typeof window === "undefined") && ( // Always show on desktop
        <div className="w-full">
          <Image
            src={song.image || "/placeholder.svg"}
            alt={song.name}
            width={200}
            height={200}
            className="mx-auto rounded-md"
          />
          <h2 className="text-xl font-bold text-center">{song.name}</h2>
          <p className="text-center text-gray-600">{song.primaryArtists}</p>
          <Button onClick={handlePlay} variant="outline" className="w-full">
            {isPlaying ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      )}
    </div>
  );
}
