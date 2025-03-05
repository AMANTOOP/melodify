import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { Play, CirclePlus } from "lucide-react";
import { AddToPlaylistDialog } from "./addToPlaylistDialog";
import { Button } from "@/components/ui/button";

const AnimatedItem = ({
  song,
  index,
  onMouseEnter,
  onClick,
  onAddToQueue,
  onAddToPlaylist,
}) => {
  const { currentSong, playSong, togglePlayPause, isPlaying, addToQueue } =
    usePlayer();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="mb-4 cursor-pointer flex items-center justify-between bg-gray-200 p-4 rounded-lg transition-all shadow-md hover:bg-gray-300 hover:scale-[1.02]"
    >
      {currentSong && currentSong.id === song.id ? <span><Play /></span> : null}
      <div>
        <p className="font-semibold text-gray-900">{song.name.split(" ").slice(0, 4).join(" ")}</p>
        <p className="text-sm text-gray-600">
          {Array.isArray(song.primaryArtists)
            ? song.primaryArtists.split(",").slice(0, 4).join(" ")
            : song.primaryArtists || "Unknown Artist"}
        </p>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-300">
          <MoreVertical size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white shadow-lg rounded-lg"
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation(); // Prevents song selection when clicking "Add to Queue"
              onAddToQueue(song);
            }}
          >
            <Button variant="outline">
            <CirclePlus className="h-6 w-6 border-black" />
            Add to Queue
            </Button>
            
            
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation(); // Prevents song selection when clicking "Add to Playlist"
              // onAddToPlaylist(song);
            }}
          >
            <AddToPlaylistDialog>
            Add to Playlist
            </AddToPlaylistDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

const AnimatedList = ({
  songs = [],
  onItemSelect,
  onAddToQueue,
  onAddToPlaylist,
  enableArrowNavigation = true,
  className = "",
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [keyboardNav, setKeyboardNav] = useState(false);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, songs.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (
        e.key === "Enter" &&
        selectedIndex >= 0 &&
        selectedIndex < songs.length
      ) {
        e.preventDefault();
        if (onItemSelect) onItemSelect(songs[selectedIndex], selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [songs, selectedIndex, onItemSelect, enableArrowNavigation]);

  return (
    <div
      className={`relative w-full bg-gray-100 rounded-xl shadow-lg ${className}`}
    >
      <div
        ref={listRef}
        className="max-h-[400px] overflow-y-auto p-2 rounded-lg bg-gray-200 scrollbar-thin scrollbar-thumb-gray-400"
      >
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <AnimatedItem
              key={index}
              song={song}
              index={index}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                setSelectedIndex(index);
                if (onItemSelect) onItemSelect(song, index);
              }}
              onAddToQueue={onAddToQueue}
              onAddToPlaylist={onAddToPlaylist}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center opacity-75">
            No songs available.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnimatedList;
