import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import { PlayerProvider } from "@/hooks/usePlayer";
import GlobalPlayer from "./_components/globalPlayer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/authContext";
import { PlaylistProvider } from "../context/playlistProvider"
import HomePopup from "./_components/homePopup"
import { RecommendationsProvider } from "@/context/recommendationContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "iodify",
  description: "World's no. 1 music player",
  icons: {
    icon: "/favicon.svg", // Default favicon
    shortcut: "/favicon.ico",
    other: {
      rel: "android-chrome",
      url: "/favicon.svg",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <PlayerProvider>
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <PlaylistProvider>
        <RecommendationsProvider>
        <AuthProvider>
        <Navbar />
        <Toaster />
        <HomePopup /> {/* Show popup on first visit */}
        {children}

        <GlobalPlayer />
        
        </AuthProvider>
        </RecommendationsProvider>
        </PlaylistProvider>
        
      </body>
    </html>
    </PlayerProvider>
  );
}
