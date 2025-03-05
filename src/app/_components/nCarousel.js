"use client";

import { useState, useEffect, useRef } from "react";
import { useRecommendations } from "@/context/recommendationContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { Card, CardContent } from "@/components/ui/card";

export default function CarouselDemo() {
  const recommendations = useRecommendations();
  const { currentSong, playSong } = usePlayer();

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

  // Handle touch swipe
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

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
          transform: `translateX(-${currentIndex * 100}%)`, // Moves one card at a time
        }}
      >
        {recommendedSongs.length > 0 ? (
          recommendedSongs.map((song, index) => (
            <div key={song.id} className="w-full flex-shrink-0">
              <Card
                onClick={() => playSong(song)}
                className="cursor-pointer shadow-lg relative overflow-hidden"
              >
                <CardContent
                  className="flex aspect-square items-center justify-center p-6 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${song.image})`,
                    width:'100%',
                    height:'100%',
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {song.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : currentSong == null ? (
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
