"use client"

import { useState, useEffect } from "react"
import { usePlaylists } from "@/context/playlistProvider"
import SongsList from "../_components/songsListInPlaylist"
import { usePlayer } from "@/hooks/usePlayer";

export default function Playlists() {
  const { playlists, fetchPlaylists, createPlaylist, deletePlaylist, error } = usePlaylists()
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [loading, setLoading] = useState(true)
  const { playSong, addToQueue, queue } = usePlayer()
  const [expandedPlaylist, setExpandedPlaylist] = useState(null); // Track expanded playlist

  // const fetchSongs = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("User not authenticated");
  //       return;
  //     }

  //     const response = await fetch("http://localhost:5000/api/backup/songs", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ songIds }),
  //     });

  //     console.log("Response Status:", response.status); // Log status

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Fetched Songs:", data); // Log API response
  //       setSongs(data);
  //     } else {
  //       const errorMessage = await response.text(); // Get error message
  //       setError(`Failed to fetch songs: ${errorMessage}`);
  //     }
  //   } catch (err) {
  //     setError("An error occurred while fetching songs");
  //     console.error("Fetch Error:", err);
  //   }
  // };

  const handlePlayAll = async (songIds) => {
    if (songIds.length === 0) return;
  
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
        body: JSON.stringify({ songIds }), // Send song IDs to fetch full details
      });
  
      console.log("Response Status:", response.status); // Log status
  
      if (response.ok) {
        const fetchedSongs = await response.json();
        console.log("Fetched Songs:", fetchedSongs); // Log fetched song data
        
        queue.length = 0;

        // Add fetched songs to queue and play the first one
        fetchedSongs.forEach((song) => addToQueue(song));
        playSong(fetchedSongs[0]); // Play first song
      } else {
        const errorMessage = await response.text();
        setError(`Failed to fetch songs: ${errorMessage}`);
      }
    } catch (err) {
      setError("An error occurred while fetching songs");
      console.error("Fetch Error:", err);
    }
  };
  

  const togglePlaylist = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId); // Toggle expansion
  };


  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true)
      await fetchPlaylists()
      setLoading(false)
    }
    loadPlaylists()
  }, [])

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return
    await createPlaylist(newPlaylistName)
    setNewPlaylistName("")
    await fetchPlaylists() // Refresh playlists after creating
  }

  const handleDeletePlaylist = async (playlistId) => {
    await deletePlaylist(playlistId)
    await fetchPlaylists() // Refresh playlists after deleting
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
      
      <form onSubmit={handleCreatePlaylist} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name"
            required
            className="flex-grow px-3 py-2 border rounded-l-md"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
            Create Playlist
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-500">No playlists found. Create one!</p>
      ) : (
        <div className="space-y-6">
      {playlists.map((playlist) => (
        <div key={playlist._id} className="border rounded-md p-4">
          {/* Playlist Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-semibold cursor-pointer"
              onClick={() => togglePlaylist(playlist._id)}
            >
              {playlist.name}
            </h2>
            <div className="flex space-x-3">
              {/* Play All Button */}
              <button
                onClick={() => handlePlayAll(playlist.songs)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                ▶ Play All
              </button>
              {/* Delete Button */}
              <button
                onClick={() => handleDeletePlaylist(playlist._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Expandable Song List */}
          {expandedPlaylist === playlist._id && (
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
              <SongsList songIds={playlist.songs} playlistId={playlist._id} />
            </div>
          )}
        </div>
      ))}
    </div>
      )}
    </div>
  )
}
