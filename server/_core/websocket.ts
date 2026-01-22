/**
 * WebSocket Infrastructure for Real-time Chat
 * 
 * This module provides WebSocket functionality for the NuFounders platform,
 * enabling real-time messaging in the Community Hub.
 * 
 * Architecture:
 * - Uses native WebSocket API compatible with Vercel Edge Functions
 * - Supports room-based messaging for peer groups and direct chats
 * - Includes presence tracking and typing indicators
 * 
 * Note: For production deployment on Vercel, consider using:
 * - Pusher, Ably, or similar real-time service
 * - Vercel's Edge Config for shared state
 * - Upstash Redis for pub/sub
 */

// ============================================================================
// TYPES
// ============================================================================

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'presence' | 'join' | 'leave' | 'system';
  roomId: number;
  userId: number;
  userName?: string;
  content?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ChatRoom {
  id: number;
  name: string;
  type: 'group' | 'direct' | 'mentor';
  participants: Set<number>;
  lastActivity: number;
}

export interface UserPresence {
  userId: number;
  status: 'online' | 'away' | 'offline';
  lastSeen: number;
  currentRoom?: number;
}

// ============================================================================
// IN-MEMORY STORE (for development/demo)
// In production, use Redis or similar for distributed state
// ============================================================================

class ChatStore {
  private rooms: Map<number, ChatRoom> = new Map();
  private userPresence: Map<number, UserPresence> = new Map();
  private recentMessages: Map<number, WebSocketMessage[]> = new Map();
  private readonly MAX_RECENT_MESSAGES = 50;

  // Room management
  createRoom(room: Omit<ChatRoom, 'participants' | 'lastActivity'>): ChatRoom {
    const newRoom: ChatRoom = {
      ...room,
      participants: new Set(),
      lastActivity: Date.now(),
    };
    this.rooms.set(room.id, newRoom);
    this.recentMessages.set(room.id, []);
    return newRoom;
  }

  getRoom(roomId: number): ChatRoom | undefined {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId: number, oderId: number): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.add(oderId);
      room.lastActivity = Date.now();
    }
  }

  leaveRoom(roomId: number, oderId: number): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.delete(oderId);
    }
  }

  getRoomParticipants(roomId: number): number[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.participants) : [];
  }

  // Message management
  addMessage(message: WebSocketMessage): void {
    const messages = this.recentMessages.get(message.roomId) || [];
    messages.push(message);
    
    // Keep only recent messages in memory
    if (messages.length > this.MAX_RECENT_MESSAGES) {
      messages.shift();
    }
    
    this.recentMessages.set(message.roomId, messages);
    
    // Update room activity
    const room = this.rooms.get(message.roomId);
    if (room) {
      room.lastActivity = Date.now();
    }
  }

  getRecentMessages(roomId: number, limit = 50): WebSocketMessage[] {
    const messages = this.recentMessages.get(roomId) || [];
    return messages.slice(-limit);
  }

  // Presence management
  setUserPresence(userId: number, status: 'online' | 'away' | 'offline', currentRoom?: number): void {
    this.userPresence.set(userId, {
      userId,
      status,
      lastSeen: Date.now(),
      currentRoom,
    });
  }

  getUserPresence(userId: number): UserPresence | undefined {
    return this.userPresence.get(userId);
  }

  getOnlineUsers(roomId?: number): number[] {
    const online: number[] = [];
    this.userPresence.forEach((presence, oderId) => {
      if (presence.status === 'online') {
        if (!roomId || presence.currentRoom === roomId) {
          online.push(presence.userId);
        }
      }
    });
    return online;
  }

  // Initialize default rooms
  initializeDefaultRooms(): void {
    const defaultRooms = [
      { id: 1, name: 'Women in Tech', type: 'group' as const },
      { id: 2, name: 'E-commerce Builders', type: 'group' as const },
      { id: 3, name: 'Atlanta Entrepreneurs', type: 'group' as const },
      { id: 4, name: 'New Founders Hub', type: 'group' as const },
      { id: 5, name: 'Mentor Lounge', type: 'mentor' as const },
    ];

    defaultRooms.forEach(room => {
      if (!this.rooms.has(room.id)) {
        this.createRoom(room);
      }
    });
  }
}

// Singleton instance
export const chatStore = new ChatStore();

// Initialize default rooms
chatStore.initializeDefaultRooms();

// ============================================================================
// MESSAGE HANDLERS
// ============================================================================

export function createChatMessage(
  roomId: number,
  userId: number,
  userName: string,
  content: string
): WebSocketMessage {
  return {
    type: 'message',
    roomId,
    userId,
    userName,
    content,
    timestamp: Date.now(),
  };
}

export function createTypingIndicator(
  roomId: number,
  userId: number,
  userName: string,
  isTyping: boolean
): WebSocketMessage {
  return {
    type: 'typing',
    roomId,
    userId,
    userName,
    timestamp: Date.now(),
    metadata: { isTyping },
  };
}

export function createPresenceUpdate(
  roomId: number,
  userId: number,
  userName: string,
  status: 'online' | 'away' | 'offline'
): WebSocketMessage {
  return {
    type: 'presence',
    roomId,
    userId,
    userName,
    timestamp: Date.now(),
    metadata: { status },
  };
}

export function createSystemMessage(
  roomId: number,
  content: string
): WebSocketMessage {
  return {
    type: 'system',
    roomId,
    userId: 0,
    content,
    timestamp: Date.now(),
  };
}

// ============================================================================
// POLLING-BASED REAL-TIME (for Vercel/serverless compatibility)
// ============================================================================

/**
 * For serverless environments like Vercel, true WebSocket connections
 * aren't supported in the same way. This provides a polling-based
 * alternative that can be used with tRPC subscriptions or regular polling.
 * 
 * For production real-time, consider:
 * 1. Pusher (pusher.com) - Easy integration
 * 2. Ably (ably.com) - Good for scale
 * 3. Upstash Redis with pub/sub
 * 4. Supabase Realtime
 */

export interface PollResult {
  messages: WebSocketMessage[];
  presence: { oderId: number; status: string }[];
  lastPollTime: number;
}

export function pollRoomUpdates(
  roomId: number,
  sincetime: number
): PollResult {
  const messages = chatStore.getRecentMessages(roomId)
    .filter(m => m.timestamp > sincetime);
  
  const participants = chatStore.getRoomParticipants(roomId);
  const presence = participants.map(userId => {
    const p = chatStore.getUserPresence(userId);
    return {
      oderId: userId,
      status: p?.status || 'offline',
    };
  });

  return {
    messages,
    presence,
    lastPollTime: Date.now(),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatMessageForClient(message: WebSocketMessage): {
  id: string;
  roomId: number;
  userId: number;
  userName: string;
  content: string;
  timestamp: Date;
  type: string;
} {
  return {
    id: `${message.roomId}-${message.timestamp}-${message.userId}`,
    roomId: message.roomId,
    userId: message.userId,
    userName: message.userName || 'Unknown',
    content: message.content || '',
    timestamp: new Date(message.timestamp),
    type: message.type,
  };
}

export function sanitizeMessageContent(content: string): string {
  // Basic sanitization - in production use a proper library
  return content
    .trim()
    .slice(0, 2000) // Max message length
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
}
