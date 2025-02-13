"use client";
import { useState, useEffect, useCallback } from "react";
import SongCard from "./songCard";
import { Button } from "@/components/ui/button";

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
          throw new Error("Network Error: Unable to connect to the server. Please check your internet connection.");
        }
  
        if (!isBackupActive && !response.ok) {
          throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
        }
  
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          throw new Error("Data Error: Failed to parse server response. Please try again later.");
        }
  
        if (!data || data.length === 0) {
          throw new Error("No songs found. Try searching with a different query.");
        }
  
        setSongs(data);
  
        // Write songs to DB if fetched from primary server
        if (data && !isBackupActive) {
          try {
            await writeToDb(data);
          } catch (dbError) {
            console.warn("Database Warning: Failed to save songs locally.", dbError);
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
    <div className="p-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a song..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setError(null); // Clear error when user starts typing
        }}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {songs.length === 0 && error && <p className="text-center text-red-500">{error}</p>}

      {/* Backup Server Button */}
      {songs.length === 0 && error && !isBackupActive && (
        <Button 
        className="block mx-auto mt-4" 
        onClick={switchToBackupServer} 
        variant="outline"
      >
        Switch to Backup Server
      </Button>
      
      )}

      {/* {!loading && songs.length === 0 && (
        <p className="text-center text-gray-500">No songs found.</p>
      )} */}

      {/* Display Songs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isExpanded={expandedSong === song.id}
              onExpand={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
            />
          ))
        ) : !error ?  (
          <p className="text-center  col-span-full">Go ahead and type!</p>
        ) : null}
      </div>
    </div>
  );
}
