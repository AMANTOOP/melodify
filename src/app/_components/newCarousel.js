"use client";

import { useEffect, useState } from "react";
import { useRecommendations } from "@/context/recommendationContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { usePlayer } from "@/hooks/usePlayer";
import { Play, Pause, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToPlaylistDialog } from "./addToPlaylistDialog";

export default function CarouselDemo() {
  const { currentSong, playSong, togglePlayPause, isPlaying, addToQueue } =
    usePlayer();
  const [loading, setLoading] = useState(false);

  const handlePlay = (e, song) => {
    e.stopPropagation(); // Prevents triggering expand when clicking play button

    if (currentSong?.id === song.id) {
      togglePlayPause(); // Pause if the same song is playing
    } else {
      playSong(song); // Play a new song
    }
  };

  const recommendations = useRecommendations();

  if (!recommendations) {
    console.error("RecommendationsProvider is missing in the component tree.");
    return null;
  }

  const { recommendedSongs = [], fetchRecommendedSongs } = recommendations;

  useEffect(() => {
    if (!currentSong) return;
  
    setLoading(true);
  
    const fetchData = async () => {
      try {
        await fetchRecommendedSongs(currentSong.id);
      } catch (error) {
        console.error("Error fetching recommended songs:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentSong]);
  

  return (
    <div className="mx-auto w-[90%] md:w-[80%] max-w-[900px] max-h-[80vh] mt-[3rem] relative">
      <p className="text-gray-500 text-xl font-bold mb-10">Play Next...</p>

      {loading ? (
        <p className="text-center text-gray-500 w-full">
          Loading recommendations...
        </p>
      ) : recommendedSongs.length > 0 ? (
        <Carousel className="w-full relative">
          {/* Carousel Content */}
          <CarouselContent>
            {recommendedSongs.map((song) => (
              <CarouselItem key={song.id} className="p-2">
                <Card
                  className="cursor-pointer shadow-lg relative overflow-hidden"
                >
                  <CardContent
                    className="flex aspect-square items-center justify-center p-6 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${song.image})`,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-between flex-col p-2">
                      <div>
                        <span className="text-white text-2xl font-semibold">
                          {song.name.split(" ").slice(0, 4).join(" ")}
                        </span>

                        <div className="text-white text-lg font-semibold">
                          {song.primaryArtists.split(",").slice(0, 4).join(" ")}
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={(event) => handlePlay(event, song)}
                          variant="outline"
                          className="ml-2"
                        >
                          {currentSong?.id === song.id && isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            addToQueue(song);
                          }}
                          variant="outline"
                          className="m-2 transition-transform duration-200 active:scale-95"
                        >
                          <CirclePlus className="h-6 w-6" />
                        </Button>
                        <AddToPlaylistDialog songId={song.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* ✅ Navigation Buttons - Now inside <Carousel /> */}
          <div className="absolute bottom-[-3rem] right-8 flex gap-2">
            <CarouselPrevious className="bg-black/50 text-white p-2 rounded-full" />
            <CarouselNext className="bg-black/50 text-white p-2 rounded-full" />
          </div>
        </Carousel>
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
  );
}
