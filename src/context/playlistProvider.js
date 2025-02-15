"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const PlaylistContext = createContext()

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([])
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPlaylists(data)
      } else {
        setError("Failed to fetch playlists")
      }
    } catch (err) {
      setError("An error occurred while fetching playlists")
    }
  }

  const createPlaylist = async (name) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        fetchPlaylists()
      } else {
        setError("Failed to create playlist")
      }
    } catch (err) {
      setError("An error occurred while creating playlist")
    }
  }

  const deletePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchPlaylists()
      } else {
        setError("Failed to delete playlist")
      }
    } catch (err) {
      setError("An error occurred while deleting playlist")
    }
  }

  return (
    <PlaylistContext.Provider value={{ playlists, fetchPlaylists, createPlaylist, deletePlaylist, error }}>
      {children}
    </PlaylistContext.Provider>
  )
}

export const usePlaylists = () => useContext(PlaylistContext)
