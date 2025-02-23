"use client";
import { Button } from "@/components/ui/button";
import { Play, Pause, CirclePlus, Bookmark, Trash } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/hooks/usePlayer"; // Use Global Player hook
import { AddToPlaylistDialog } from "./addToPlaylistDialog";
import AuthContext from "@/context/authContext"; // Import custom hook
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function SongCard({ song, isExpanded, onExpand, playlistId }) {
  const { currentSong, playSong, togglePlayPause, isPlaying, addToQueue } =
    usePlayer();
  const { isLoggedIn, user, logout } = useContext(AuthContext); // ✅ Use custom hook
  const pathname = usePathname();
  const [isDeleted, setIsDeleted] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation(); // Prevents triggering expand when clicking play button
    console.log({ song });

    if (currentSong?.id === song.id) {
      togglePlayPause(); // Pause if the same song is playing
    } else {
      playSong(song); // Play a new song
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!playlistId) return;

    // setLoading(true);
    // setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}/songs/${songId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove song");
      }

      toast.success(" Song removed successfully!");
      setIsDeleted(true);
      // console.log({ songId });
    } catch (error) {
      toast.error("Failed to remove song.");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isDeleted ? "hidden" : "block"
      } w-full bg-white rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
        isExpanded ? "p-4 space-y-4" : "flex items-center justify-between p-2"
      } md:p-4 md:space-y-4 md:cursor-default`}
      onClick={onExpand}
    >
      {/* Mobile View (Collapsed) */}
      <div className="flex items-center w-full">
        <h2 className="text-lg font-bold flex-1 truncate">{song.name}</h2>
        <Button onClick={handlePlay} variant="outline" className="ml-2">
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
        {isLoggedIn && <AddToPlaylistDialog songId={song.id} />}
        {pathname === "/playlists" && (
          <Button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleDeleteSong(song.id); // Call delete function with song ID
            }}
            variant="destructive"
            className="m-2 transition-transform duration-200 active:scale-95"
          >
            <Trash className="h-6 w-6" />
          </Button>
        )}
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
          <p className="text-center text-gray-600">
            {song.primaryArtists
              ?.split(",") // Split if it's a comma-separated string
              .slice(0, 2) // Take only the first 5 artists
              .join(", ")}{" "}
            {/* Join them back with commas */}
          </p>
          <Button onClick={handlePlay} variant="outline" className="w-full">
            {currentSong?.id === song.id && isPlaying ? (
              <Pause className="h-6 w-6 mr-2" />
            ) : (
              <Play className="h-6 w-6 mr-2" />
            )}
            {currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      )}
    </div>
  );
}
