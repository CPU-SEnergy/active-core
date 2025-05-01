"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, X, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";


const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);
  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return null;
  }

  const sendMessage = () => {
    if (message.trim()) {
      setChat((prev) => [...prev, message]);
      setMessage("");
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 min">
        <Button
          onClick={() => setIsOpen(true)}
          className="p-8 rounded-full shadow-xl "
        >
          <MessageSquare className="w-16 h-16" />
        </Button>
      </div>
    );
  }
  


  return (
    <Card className="fixed bottom-5 right-5 w-80 shadow-xl rounded-2xl bg-white border border-gray-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Chat with us Now!</h3>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-60 overflow-y-auto bg-gray-100 p-3 rounded-lg mb-3">
          {chat.length === 0 ? (
            <p className="text-gray-500">No messages yet...</p>
          ) : (
            chat.map((msg, index) => (
              <div key={index} className="my-2">
                <p className="bg-blue-100 rounded-lg p-2 text-sm">{msg}</p>
              </div>
            ))
          )}
        </div>


        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }} 
          className="flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatWidget;
