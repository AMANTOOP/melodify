"use client";
import { useState, useEffect } from "react";
import SongCard from "./songCard";
import { Button } from "@/components/ui/button";

export default function TrendingSongs() {
  const trendingUrl = `${process.env.NEXT_PUBLIC_API_URL}/trending`;
  const searchApiUrl = `${process.env.NEXT_PUBLIC_GLOBAL_API_URL}/search?name=`;

  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSong, setExpandedSong] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 10; // Load 10 songs at a time

  useEffect(() => {
    setTrendingSongs([]); // Reset songs to avoid duplication on revisit
    setOffset(0); // Reset offset
    fetchTrendingSongs(true);
  }, []);

  const fetchTrendingSongs = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${trendingUrl}?offset=${isInitialLoad ? 0 : offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trending songs");
      }

      const songNames = await response.json();
      if (!Array.isArray(songNames) || songNames.length === 0) {
        throw new Error("No trending songs available");
      }

      const fetchSongDetails = async (name) => {
        try {
          const searchResponse = await fetch(`${searchApiUrl}${encodeURIComponent(name)}`);
          if (!searchResponse.ok) return null;
          const results = await searchResponse.json();
          return results?.[0] || null;
        } catch {
          return null;
        }
      };

      const songDetails = await Promise.all(songNames.map(async (name) => await fetchSongDetails(name)));

      const uniqueSongs = Array.from(new Map(songDetails.map((song) => [song?.id, song])).values())
        .filter(Boolean); // Remove null values

      setTrendingSongs((prevSongs) => {
        const existingIds = new Set(prevSongs.map((song) => song.id));
        const newUniqueSongs = uniqueSongs.filter((song) => !existingIds.has(song.id));
        return isInitialLoad ? uniqueSongs : [...prevSongs, ...newUniqueSongs];
      });

      await writeToDb(uniqueSongs); // Save only new songs to DB
      setOffset((prevOffset) => prevOffset + limit);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const writeToDb = async (songs) => {
    if (!songs || songs.length === 0) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-songs`, {
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

  return (
    <div className="mt-12 p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Trending Songs 🔥</h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendingSongs.length > 0 ? (
          trendingSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isExpanded={expandedSong === song.id}
              onExpand={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
            />
          ))
        ) : !loading && !error ? (
          <p className="text-center col-span-full">No trending songs available.</p>
        ) : null}
      </div>

      <div className="flex justify-center mt-4">
        <Button onClick={() => fetchTrendingSongs(false)} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  );
}
