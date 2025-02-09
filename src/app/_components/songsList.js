"use client";
import { useState, useEffect, useCallback } from "react";
import SongCard from "./songCard";

export default function SongsList() {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSong, setExpandedSong] = useState(null); // Track expanded song

  // Function to fetch songs (with debounce)
  const fetchSongs = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);

      const url = query
        ? `https://iodify-dev-backend.onrender.com/api/search?q=${query}`
        : `https://iodify-dev-backend.onrender.com/api/songs`;

      const response = await fetch(url);
      const data = await response.json();

      setSongs(data);
    } catch (err) {
      setError("Failed to load songs.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all songs on mount
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Handle search with debounce (delay API calls)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchSongs(searchQuery);
    }, 500); // Debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchQuery, fetchSongs]);

  // Handle song expansion
  const handleExpand = (songId) => {
    setExpandedSong((prev) => (prev === songId ? null : songId));
  };

  return (
    <div className="p-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a song..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && songs.length === 0 && <p className="text-center text-gray-500">No songs found.</p>}

      {/* Display Songs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isExpanded={expandedSong === song.id}
            onExpand={() => handleExpand(song.id)}
          />
        ))}
      </div>
    </div>
  );
}
