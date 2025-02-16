"use client"
import { useState, useEffect, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/authContext";
import { usePathname } from "next/navigation";

export default function HomePopup() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext); // ✅ Use custom hook
  const pathname = usePathname();

  useEffect(() => {
    if(!isLoggedIn && pathname === "/") {
      setOpen(true);
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
