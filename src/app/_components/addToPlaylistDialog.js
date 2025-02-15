import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePlaylists } from "@/context/playlistProvider";
import { Bookmark } from "lucide-react";
import { usePathname } from "next/navigation";

export function AddToPlaylistDialog({ songId }) {
  const { playlists, fetchPlaylists } = usePlaylists();
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/playlists") return null;

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddSong = async () => {
    if (!selectedPlaylist) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${selectedPlaylist}/songs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ songId: String(songId) }),
          // Ensuring the correct format
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add song");
      }
      
      setMessage("✅ Song added successfully!");
      console.log({songId});
      setTimeout(() => setOpen(false), 1000);
    } catch (error) {
      setMessage("❌ Song is alerady in playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) setSelectedPlaylist(""); // Reset selection when opening
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={(event) => {
            // event.preventDefault();
            event.stopPropagation();
          }}> <Bookmark/> </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Add to Playlist
          </DialogTitle>
          <DialogDescription>
            Select one playlist to add this song.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label className="text-md font-semibold">Choose Playlist:</Label>
          <RadioGroup
            value={selectedPlaylist}
            onValueChange={setSelectedPlaylist}
          >
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div key={playlist._id} className="flex items-center space-x-3">
                  <RadioGroupItem value={playlist._id} id={playlist._id} />
                  <Label htmlFor={playlist._id} className="cursor-pointer">
                    {playlist.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No playlists available.</p>
            )}
          </RadioGroup>

          {message && (
            <p
              className={`text-sm ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSong}
            disabled={!selectedPlaylist || loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
