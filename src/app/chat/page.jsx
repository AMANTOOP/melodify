"use client";
import { useContext } from "react";
import { useSearchParams } from "next/navigation";
import AuthContext from "@/context/authContext";
import Chat from "../_components/chat";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get("user"); // Get the selected user from query params

  if (!user) return <p className="text-gray-500">Loading...</p>;
  if (!otherUserId) return <p className="text-gray-500">No user selected</p>;

  return (
    <div className="flex flex-col overflow-y-auto max-h-[75vh]">
      <Chat currentUser={user._id} otherUser={otherUserId} />
    </div>
  );
};

export default ChatPage;
