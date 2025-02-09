"use client";
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Play, Pause } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useJioSaavnAPI } from "@/hooks/useJioSaavnAPI"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import SongsList from "@/app/_components/songsList";

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
      // handleSearch(transcript)
    }
  }, [transcript])

  // const handleSearch = useCallback(async (searchQuery) => {
  //   const result = await searchSong(searchQuery)
  //   if (result) {
  //     setSongData(result)
  //     setAudioSrc(result.url)
  //   }
  // }, [searchSong, setAudioSrc])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
    setIsListening(!isListening)
  }

  return (
    (<div className="flex flex-col items-center space-y-4 w-full bg-gray-100 min-h-[500px] max-h-[80vh] overflow-y-auto">
      <Button
        onClick={toggleListening}
        variant="outline"
        size="icon"
        className="w-12 h-12">
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      <p className="text-lg text-center">{query || "*(Experimental features)"}</p>
      {isLoading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {query && (
        <SongsList apiUrl="https://iodify-dev-backend.onrender.com/api" externalQuery={query} />
      )}
    </div>)
  );
}

