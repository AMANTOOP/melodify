import { Button } from "@/components/ui/button";
import VoiceAssistant from "@/components/VoiceAssistant"; // Make sure this is correctly imported
import Link from "next/link";

export default function Home() {
  return (
    (<main
      className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Developed <br></br> & <br></br> Maintained by<br></br> Aman</h1>
      <p className="text-xl mb-8 text-center">Say a song name, artist, or album to start playing music!</p>
      <Button className="text-lg mb-8">
      <Link href="/dev-fav">Aman's favorite</Link></Button>
      <VoiceAssistant />
    </main>)
  );
}

