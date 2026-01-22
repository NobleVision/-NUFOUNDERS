import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Users,
  Sparkles,
  MessageSquare,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip
} from "lucide-react";

interface ChatMessage {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatRoom {
  id: number;
  name: string;
  type: "group" | "direct" | "mentor";
  memberCount: number;
  lastActivity?: Date;
}

interface CommunityChatProps {
  roomId?: number;
  roomName?: string;
  className?: string;
}

// Mock data for demo
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    userId: 2,
    userName: "Keisha Williams",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
    userRole: "mentor",
    content: "Welcome to the Women in Tech group! 🎉 Feel free to introduce yourself and share what you're working on.",
    timestamp: new Date(Date.now() - 3600000 * 2),
    isOwn: false,
  },
  {
    id: 2,
    userId: 3,
    userName: "Tamara Johnson",
    userAvatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop",
    content: "Hi everyone! I just completed the Digital Marketing course and I'm looking to connect with others who are building e-commerce businesses.",
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: 3,
    userId: 4,
    userName: "Destiny Carter",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    content: "That's awesome Tamara! I have an e-commerce business selling handmade jewelry. Happy to share what I've learned!",
    timestamp: new Date(Date.now() - 1800000),
    isOwn: false,
  },
  {
    id: 4,
    userId: 1,
    userName: "You",
    content: "Thanks for the warm welcome! I'm excited to be here. Currently exploring business ideas in the tech space.",
    timestamp: new Date(Date.now() - 900000),
    isOwn: true,
  },
  {
    id: 5,
    userId: 2,
    userName: "Keisha Williams",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
    userRole: "mentor",
    content: "Great to have you! The AI Literacy course is a fantastic starting point if you're looking at tech businesses. Have you checked it out?",
    timestamp: new Date(Date.now() - 600000),
    isOwn: false,
  },
];

const MOCK_ROOMS: ChatRoom[] = [
  { id: 1, name: "Women in Tech", type: "group", memberCount: 342 },
  { id: 2, name: "E-commerce Builders", type: "group", memberCount: 278 },
  { id: 3, name: "Atlanta Entrepreneurs", type: "group", memberCount: 156 },
  { id: 4, name: "Keisha Williams (Mentor)", type: "mentor", memberCount: 2 },
];

export function CommunityChat({ roomId = 1, roomName = "Women in Tech", className = "" }: CommunityChatProps) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(MOCK_ROOMS[0]);
  const [lastPollTime, setLastPollTime] = useState(Date.now() - 60000);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC mutations and queries
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      // Message already added optimistically, just update with server data
      setLastPollTime(Date.now());
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });

  // Poll for new messages every 3 seconds when authenticated
  const { data: pollData } = trpc.chat.poll.useQuery(
    { roomId: selectedRoom.id, since: lastPollTime },
    { 
      enabled: isAuthenticated,
      refetchInterval: 3000, // Poll every 3 seconds
      refetchIntervalInBackground: false,
    }
  );

  // Update messages when poll data arrives
  useEffect(() => {
    if (pollData?.messages && pollData.messages.length > 0) {
      const newMessages = pollData.messages.filter(
        pm => !messages.some(m => m.id === pm.userId && m.timestamp.getTime() === new Date(pm.timestamp).getTime())
      );
      if (newMessages.length > 0) {
        setMessages(prev => [
          ...prev,
          ...newMessages.map(m => ({
            id: m.userId * 1000 + Date.now(),
            userId: m.userId,
            userName: m.userName,
            content: m.content,
            timestamp: new Date(m.timestamp),
            isOwn: m.userId === user?.id,
          })),
        ]);
        setLastPollTime(pollData.lastPollTime);
      }
    }
  }, [pollData, messages, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isSending) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      userId: user?.id || 1,
      userName: user?.name || "You",
      content: inputValue.trim(),
      timestamp: new Date(),
      isOwn: true,
    };

    setIsSending(true);
    setMessages(prev => [...prev, newMessage]);
    const messageContent = inputValue.trim();
    setInputValue("");

    // Try to send via API, fall back to demo mode
    try {
      await sendMessageMutation.mutateAsync({
        roomId: selectedRoom.id,
        content: messageContent,
      });
    } catch {
      // Already added optimistically, just log
      console.log("Message sent in demo mode");
    }
    
    setIsSending(false);

    // Focus back on input
    inputRef.current?.focus();
  }, [inputValue, isSending, messages.length, user?.name]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Sign in to join the conversation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex h-[600px] rounded-lg border border-border overflow-hidden ${className}`}>
      {/* Sidebar - Room List */}
      <div className="w-64 border-r border-border bg-muted/30 hidden md:block">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Conversations
          </h3>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-1">
            {MOCK_ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedRoom.id === room.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    room.type === "mentor" ? "bg-secondary/20" : "bg-primary/10"
                  }`}>
                    {room.type === "mentor" ? (
                      <Sparkles className="w-5 h-5 text-secondary" />
                    ) : (
                      <Users className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{room.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {room.type === "mentor" ? "Mentor Chat" : `${room.memberCount} members`}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedRoom.type === "mentor" ? "bg-secondary/20" : "bg-primary/10"
            }`}>
              {selectedRoom.type === "mentor" ? (
                <Sparkles className="w-5 h-5 text-secondary" />
              ) : (
                <Users className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{selectedRoom.name}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedRoom.type === "mentor" ? "Mentor Session" : `${selectedRoom.memberCount} members`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}
                >
                  {!message.isOwn && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.userAvatar} />
                      <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] ${message.isOwn ? "text-right" : ""}`}>
                    {!message.isOwn && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.userName}</span>
                        {message.userRole === "mentor" && (
                          <Badge variant="secondary" className="text-xs py-0">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Mentor
                          </Badge>
                        )}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 inline-block ${
                        message.isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Smile className="w-4 h-4" />
            </Button>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isSending}
              size="icon"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityChat;
