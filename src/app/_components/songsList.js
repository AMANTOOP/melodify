"use client";
import { useState, useEffect, useCallback } from "react";
import SongCard from "./songCard";
import { Button } from "@/components/ui/button";
import AnimatedList from "./AnimatedList1";
import { usePlayer } from "@/hooks/usePlayer";

export default function SongsList({ apiUrl, externalQuery = "" }) {
  const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL; // Default API URL
  const backupApiUrl = process.env.NEXT_PUBLIC_BACKUP_API_URL; // Backup API URL

  const [serverUrl, setServerUrl] = useState(apiUrl || defaultApiUrl);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSong, setExpandedSong] = useState(null); // Track expanded song
  const [isBackupActive, setIsBackupActive] = useState(false);
  const { currentSong, playSong, togglePlayPause, isPlaying, addToQueue } =
      usePlayer();

  const handlePlay = (e, song) => {

    if (currentSong?.id === song.id) {
      togglePlayPause(); // Pause if the same song is playing
    } else {
      playSong(song); // Play a new song
    }
  };

  useEffect(() => {
    if (externalQuery) {
      setSearchQuery(externalQuery);
    }
  }, [externalQuery]);

  // Function to write songs to DB
  const writeToDb = async (songs) => {
    if (!songs || songs.length === 0) return;
    try {
      const response = await fetch(`${defaultApiUrl}/save-songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songs }),
      });

      const result = await response.json();
      console.log("Songs saved:", result);
    } catch (error) {
      console.error("Error saving songs to DB:", error);
    }
  };

  // Function to fetch songs
  const fetchSongs = useCallback(
    async (query = "") => {
      try {
        setLoading(true);
        setError(null);

        let url = query
          ? `${serverUrl}/search?q=${encodeURIComponent(query)}`
          : `${serverUrl}/songs`;

        if (apiUrl) {
          url = `${serverUrl}/search?name=${encodeURIComponent(query)}`;
        }

        let response;
        try {
          response = await fetch(url);
        } catch (networkError) {
          throw new Error(
            "Network Error: Unable to connect to the server. Please check your internet connection."
          );
        }

        if (!isBackupActive && !response.ok) {
          throw new Error(
            `Server Error: ${response.status} - ${response.statusText}`
          );
        }

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          throw new Error(
            "Data Error: Failed to parse server response. Please try again later."
          );
        }

        if (!data || data.length === 0) {
          throw new Error(
            "No songs found. Try searching with a different query."
          );
        }

        setSongs(data);

        // Write songs to DB if fetched from primary server
        if (data && !isBackupActive) {
          try {
            await writeToDb(data);
          } catch (dbError) {
            console.warn(
              "Database Warning: Failed to save songs locally.",
              dbError
            );
          }
        }
      } catch (err) {
        setError(err.message); // Display the specific error message
      } finally {
        setLoading(false);
      }
    },
    [serverUrl, isBackupActive]
  );

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchSongs(searchQuery);
    }, 500); // Debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchQuery, fetchSongs]);

  // Handle backup server switch
  const switchToBackupServer = () => {
    setIsBackupActive(true);
    setServerUrl(backupApiUrl);
    fetchSongs(searchQuery); // Fetch again using backup server
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto overflow-hidden">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a song..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setError(null); // Clear error when user starts typing
          }}
          className="w-full p-3 pl-10 border border-gray-500 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 outline-none transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 2a6 6 0 1 1-3.872 10.743l-3.242 3.243a1 1 0 0 1-1.414-1.414l3.243-3.242A6 6 0 0 1 8 2zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
          />
        </svg>
      </div>
  
      {/* Loading & Error Handling */}
      {loading && (
        <p className="text-center text-gray-400 mt-4 animate-pulse">
          Searching for songs...
        </p>
      )}
      {songs.length === 0 && error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}
  
      {/* Backup Server Button */}
      {songs.length === 0 && error && !isBackupActive && (
        <button
          onClick={switchToBackupServer}
          className="block mx-auto mt-4 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Switch to Backup Server
        </button>
      )}
  
      {/* Responsive Song List */}
      <div className="mt-2 bg-gray-100 p-0 rounded-lg shadow-lg w-full">
        <div className="overflow-x-auto w-full">
          <div className="w-full min-w-[300px] max-w-full">
            <AnimatedList
              songs={songs}
              onItemSelect={(event, index) => handlePlay(event, songs[index])}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
              onAddToQueue={addToQueue}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
    
}
