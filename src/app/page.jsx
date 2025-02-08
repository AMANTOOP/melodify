import VoiceAssistant from "@/components/VoiceAssistant"

export default function Home() {
  return (
    (<main
      className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Jio Saavn Voice Assistant</h1>
      <p className="text-xl mb-8 text-center">Say a song name, artist, or album to start playing music!</p>
      <VoiceAssistant />
    </main>)
  );
}

