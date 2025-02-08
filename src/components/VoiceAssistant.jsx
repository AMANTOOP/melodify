"use client";
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Play, Pause } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useJioSaavnAPI } from "@/hooks/useJioSaavnAPI"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import Image from "next/image"

export default function VoiceAssistant() {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [songData, setSongData] = useState(null)

  const { transcript, startListening, stopListening } = useSpeechRecognition()
  const { searchSong, isLoading, error } = useJioSaavnAPI()
  const { isPlaying, togglePlayPause, setAudioSrc } = useAudioPlayer()

  useEffect(() => {
    if (transcript) {
      setQuery(transcript)
      handleSearch(transcript)
    }
  }, [transcript])

  const handleSearch = useCallback(async (searchQuery) => {
    const result = await searchSong(searchQuery)
    if (result) {
      setSongData(result)
      setAudioSrc(result.url)
    }
  }, [searchSong, setAudioSrc])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
    setIsListening(!isListening)
  }

  return (
    (<div className="flex flex-col items-center space-y-4 w-full max-w-md">
      <Button
        onClick={toggleListening}
        variant="outline"
        size="icon"
        className="w-12 h-12">
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      <p className="text-lg text-center">{query || "Say a song name, artist, or album..."}</p>
      {isLoading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {songData && (
        <div className="w-full bg-white rounded-lg shadow-md p-4 space-y-4">
          <Image
            src={songData.image || "/placeholder.svg"}
            alt={songData.name}
            width={200}
            height={200}
            className="mx-auto rounded-md" />
          <h2 className="text-xl font-bold text-center">{songData.name}</h2>
          <p className="text-center text-gray-600">{songData.primaryArtists}</p>
          <Button onClick={togglePlayPause} variant="outline" className="w-full">
            {isPlaying ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      )}
    </div>)
  );
}

