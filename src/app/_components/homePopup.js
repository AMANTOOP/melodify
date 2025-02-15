"use client"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function HomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("seenPopup");
    if (!hasSeenPopup) {
      setOpen(true); // Show popup
      localStorage.setItem("seenPopup", "true"); // Mark as seen
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="items-center justify-center">
        <DialogHeader>
          <DialogTitle>Welcome to iodify! 🎵</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">Enjoy your favorite songs <br></br>Sign in to enjoy all features </p>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
