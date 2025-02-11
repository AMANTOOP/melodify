import { Button } from "@/components/ui/button";
import VoiceAssistant from "@/components/VoiceAssistant"; // Make sure this is correctly imported
import { PlayerProvider } from "@/hooks/usePlayer";
import Link from "next/link";


export default function Home() {
  return (
    (
    <>
    <VoiceAssistant />
    <main
      className="flex  flex-col items-center justify-center p-24 bg-gray-100 my-0" style={{minHeight:"75vh"}}>
      <Button className="text-lg mb-8">
      <Link href="/dev-fav">Aman's favorite</Link>
      </Button>
      <h1 className="text-lg font-bold mb-8 text-center">Developed <br></br> & <br></br> Maintained by<br></br> Aman</h1>
      {/* <p className="text-sm mb-8 text-center"></p> */}
      
    </main>
    
    
    </>)
  );
}

