"use client";
import { useState, useCallback } from "react"

export function useJioSaavnAPI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchSong = useCallback(async query => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch song")
      }
      const data = await response.json()
      setIsLoading(false)
      return data
    } catch (err) {
      setError("Error fetching song")
      setIsLoading(false)
      console.error(err)
      return null
    }
  }, [])

  return { searchSong, isLoading, error }
}

