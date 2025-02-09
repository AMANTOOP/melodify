import { Button } from "@/components/ui/button";
import VoiceAssistant from "@/components/VoiceAssistant"; // Make sure this is correctly imported
import Link from "next/link";

export default function Home() {
  return (
    (
    <>
    <VoiceAssistant />
    <main
      className="flex  flex-col items-center justify-center p-24 bg-gray-100 my-0" style={{minHeight:"75vh"}}>
      <h1 className="text-lg font-bold mb-8 text-center">Developed <br></br> & <br></br> Maintained by<br></br> Aman</h1>
      <p className="text-sm mb-8 text-center">Say a song name, artist, or album to start playing music!</p>
      <Button className="text-lg mb-8">
      <Link href="/dev-fav">Aman's favorite</Link>
      </Button>
    </main>
    
    </>)
  );
}

