"use client";

import { useState, useEffect } from "react";
import SongCard from "./songCard";

export default function SongsList({ songIds, playlistId, fetchPlaylists }) {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [expandedSong, setExpandedSong] = useState(null);

  useEffect(() => {
    if (!songIds) {
      setError("No song IDs provided");
      return;
    }
    if(songIds.length === 0){
      setError("No songs in this playlist");
      return;
    }

    console.log("Fetching songs for songIds:", songIds); // Debugging log

    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKUP_API_URL}/songs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ songIds }),
        });

        console.log("Response Status:", response.status); // Log status

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Songs:", data); // Log API response
          setSongs(data);
        } else {
          const errorMessage = await response.text(); // Get error message
          setError(`Failed to fetch songs: ${errorMessage}`);
        }
      } catch (err) {
        setError("An error occurred while fetching songs");
        console.error("Fetch Error:", err);
      }
    };

    fetchSongs();
  }, [songIds]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!songs.length)
    return <p className="text-gray-500">No songs in this playlist</p>;

  return (
    <ul className="border-t pt-2 space-y-2">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isExpanded={expandedSong === song.id}
          onExpand={() =>
            setExpandedSong(expandedSong === song.id ? null : song.id)
          }
        />
      ))}
    </ul>
  );
}
