import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch chat history on mount
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentUser}/${otherUser}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      if (
        (newMessage.sender === currentUser && newMessage.receiver === otherUser) ||
        (newMessage.sender === otherUser && newMessage.receiver === currentUser)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ React re-renders on state change
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUser, otherUser, messages]); // ✅ Re-run effect when messages change

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { sender: currentUser, receiver: otherUser, message };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const savedMessage = await res.json();

      socket.emit("sendMessage", savedMessage);

      setMessages((prevMessages) => [...prevMessages, savedMessage]); // ✅ Update state to trigger re-render

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-green-500 text-white p-4 font-bold text-lg">
        Chat with {otherUser?.name}
      </div>
  
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-white ${
                msg.sender === currentUser ? "bg-green-500" : "bg-gray-300 text-black"
              }`}
            >
              <p className="text-sm">
                <strong>{msg.sender === currentUser ? "You" : "Them"}:</strong> {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
  
      {/* Chat Input */}
      <div className="bg-white p-4 flex items-center border-t">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-full outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
  
};

export default Chat;
