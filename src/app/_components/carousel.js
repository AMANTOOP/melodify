"use client";

import { useState, useEffect, useRef } from "react";
import { useRecommendations } from "@/context/recommendationContext";
import SongCard from "./songCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";

export default function Carousel() {
  const recommendations = useRecommendations();
  const { currentSong, playSong, togglePlayPause, isPlaying, addToQueue } =
    usePlayer();

  if (!recommendations) {
    console.error("RecommendationsProvider is missing in the component tree.");
    return null;
  }

  const { recommendedSongs = [], fetchRecommendedSongs } = recommendations;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (currentSong) fetchRecommendedSongs(currentSong.id);
  }, [currentSong]);

  const nextSlide = () => {
    if (currentIndex < recommendedSongs.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const deltaX = e.touches[0].clientX - startX;

    if (deltaX > 50) {
      prevSlide();
      setIsSwiping(false);
    } else if (deltaX < -50) {
      nextSlide();
      setIsSwiping(false);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsSwiping(false);
  };

  return (
    <div
      className="relative mx-auto w-[90%] md:w-[80%] max-w-[900px] max-h-[80vh] mt-[3rem] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <p className="text-gray-500 text-xl font-bold mb-10">Play Next...</p>

      <div
        ref={carouselRef}
        className="flex gap-4 transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 260}px)`, // Moves only one card at a time
        }}
      >
        {recommendedSongs.length > 0 ? (
          recommendedSongs.map((song, index) => (
            <div key={song.id} className="w-[250px] flex-shrink-0">
              <SongCard song={song} isExpanded={true} />
            </div>
          ))
        ) : currentSong==null ? (
          <p className="text-center text-gray-500 w-full">
            Play a song to get recommendations.
          </p>
        ) : (
          <p className="text-center text-gray-500 w-full">
            No recommended songs found.
          </p>
        )}
      </div>

      {recommendedSongs.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Button>
          <Button
            onClick={nextSlide}
            disabled={currentIndex === recommendedSongs.length - 1}
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 ${
              currentIndex === recommendedSongs.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </Button>
        </>
      )}
    </div>
  );
}
