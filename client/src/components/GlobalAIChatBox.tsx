/**
 * Global AI ChatBox Component
 * 
 * A persistent AI assistant that appears on all pages of the NuFounders platform.
 * Features:
 * - Floating toggle button
 * - Context-aware suggested prompts based on current page
 * - Chat history persistence with localStorage
 * - Real tRPC integration with AI backend
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Sparkles,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Context-aware suggested prompts based on current page
const PAGE_PROMPTS: Record<string, string[]> = {
  "/dashboard": [
    "How can I improve my progress?",
    "What should I focus on next?",
    "Show me available opportunities",
    "Recommend a course for me",
  ],
  "/courses": [
    "Recommend courses for my skill level",
    "Which course should I start with?",
    "How long will courses take to complete?",
    "What skills are most in-demand?",
  ],
  "/business": [
    "Help me brainstorm business ideas",
    "Review my business plan",
    "What funding options are available?",
    "How do I validate my idea?",
  ],
  "/community": [
    "How do I network effectively?",
    "Find mentors in my field",
    "How can I contribute to the community?",
    "Connect me with similar entrepreneurs",
  ],
  "/events": [
    "What events should I attend?",
    "How do pitch competitions work?",
    "Tips for networking events",
    "How can I prepare for workshops?",
  ],
  "/scholarships": [
    "Am I eligible for scholarships?",
    "How do I apply for funding?",
    "What grants are available?",
    "Tips for scholarship applications",
  ],
  default: [
    "What is NuFounders?",
    "How do I get started?",
    "What can you help me with?",
    "Show me success stories",
  ],
};

// Storage key for chat history
const CHAT_STORAGE_KEY = "nufounders_ai_chat_history";
const CHAT_OPEN_KEY = "nufounders_ai_chat_open";

// Get page name from path
const getPageName = (path: string): string => {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
};

// Get suggested prompts for current page
const getPromptsForPage = (path: string): string[] => {
  // Check for exact match first
  if (PAGE_PROMPTS[path]) return PAGE_PROMPTS[path];
  
  // Check for partial match (e.g., /courses/1 matches /courses)
  const basePath = "/" + path.split("/").filter(Boolean)[0];
  if (PAGE_PROMPTS[basePath]) return PAGE_PROMPTS[basePath];
  
  return PAGE_PROMPTS.default;
};

export function GlobalAIChatBox() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // tRPC mutation for AI chat
  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        saveToStorage(newMessages);
        return newMessages;
      });
      
      // Mark unread if chat is closed
      if (!isOpen) {
        setHasUnread(true);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
      
      const wasOpen = localStorage.getItem(CHAT_OPEN_KEY);
      if (wasOpen === "true") {
        setIsOpen(true);
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  }, []);

  // Save chat history to localStorage
  const saveToStorage = useCallback((msgs: Message[]) => {
    try {
      // Keep only last 50 messages to avoid storage limits
      const toSave = msgs.slice(-50);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  }, []);

  // Save open state
  useEffect(() => {
    localStorage.setItem(CHAT_OPEN_KEY, isOpen.toString());
  }, [isOpen]);

  // Handle sending a message
  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveToStorage(newMessages);

    // Send to AI with context
    chatMutation.mutate({
      messages: newMessages,
      context: {
        currentPage: getPageName(location),
        userName: user?.name || undefined,
        userGoals: user?.goals || undefined,
      },
    });
  }, [messages, location, user, chatMutation, saveToStorage]);

  // Clear chat history
  const handleClearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  // Toggle chat open/close
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    setHasUnread(false);
    setIsMinimized(false);
  }, []);

  // Get current page prompts
  const currentPrompts = getPromptsForPage(location);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleChat}
              size="lg"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all",
                "bg-primary hover:bg-primary/90",
                hasUnread && "animate-pulse ring-2 ring-primary ring-offset-2"
              )}
            >
              <Sparkles className="h-6 w-6" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "600px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="overflow-hidden shadow-2xl border-2">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Nova AI Assistant</h3>
                    <p className="text-xs opacity-80">
                      {getPageName(location)} • Here to help
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              {!isMinimized && (
                <div className="h-[calc(600px-60px)]">
                  <AIChatBox
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={chatMutation.isPending}
                    placeholder="Ask Nova anything..."
                    height="100%"
                    emptyStateMessage={`Hi${user?.name ? ` ${user.name}` : ''}! I'm Nova, your AI assistant. How can I help you today?`}
                    suggestedPrompts={currentPrompts}
                    className="border-0 rounded-none shadow-none"
                  />
                </div>
              )}

              {/* Minimized Footer */}
              {isMinimized && (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  Click to expand chat
                </div>
              )}

              {/* Clear Chat Option */}
              {!isMinimized && messages.length > 0 && (
                <div className="px-4 py-2 border-t bg-muted/30">
                  <button
                    onClick={handleClearChat}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear conversation
                  </button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalAIChatBox;
