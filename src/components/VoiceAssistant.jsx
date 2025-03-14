"use client";
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Play, Pause } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useJioSaavnAPI } from "@/hooks/useJioSaavnAPI"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import SongsList from "@/app/_components/songsList";
import MicButton from "@/app/_components/voiceButton";

export default function VoiceAssistant() {
  const url = process.env.NEXT_PUBLIC_GLOBAL_API_URL; 
  const [query, setQuery] = useState("")
  const [songData, setSongData] = useState(null)

  const { transcript, startListening, stopListening, isListening } = useSpeechRecognition()
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
    isListening ? stopListening() : startListening();
  };

  return (
    (
      <div className="flex flex-col items-center space-y-4 w-full bg-gray-100 mb-[6rem]">
        <MicButton toggleListening={toggleListening} isListening={isListening} />
    <div className=" min-h-[500px] max-h-[80vh] overflow-y-auto w-full min-w-[300px] max-w-full">
      
      <p className="text-lg text-center">{query || "Say a song name, artist, or album to start playing music!"}</p>
      {isLoading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {query && (
        <SongsList apiUrl={url} externalQuery={query} />
      )}
    </div>
    </div>)
  );
}

