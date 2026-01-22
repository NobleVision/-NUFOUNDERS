/**
 * Text-to-Speech service using OpenAI TTS API
 * 
 * Designed for empowering content delivery to displaced Black women entrepreneurs.
 * Uses the "onyx" voice by default - a deep, rich, commanding voice that conveys
 * authority and confidence while remaining warm and encouraging.
 * 
 * Architecture supports future extension to other providers (ElevenLabs, Respeacher).
 * 
 * Frontend implementation guide:
 * ```tsx
 * // Frontend component
 * const ttsMutation = trpc.voice.synthesize.useMutation({
 *   onSuccess: (data) => {
 *     const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
 *     audio.play();
 *   }
 * });
 * 
 * // Generate speech
 * ttsMutation.mutate({
 *   text: "Welcome to your entrepreneurship journey!",
 *   voice: "onyx", // optional, defaults to onyx
 *   speed: 1.0 // optional, 0.25 to 4.0
 * });
 * ```
 */
import { ENV } from "./env";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Available OpenAI TTS voices
 * 
 * Voice recommendations for NuFounders:
 * - onyx: Deep, rich, commanding - PRIMARY (empowering, authoritative)
 * - nova: Warm, professional - SECONDARY (friendly, approachable)
 * - shimmer: Vibrant, energetic - FOR CELEBRATIONS (achievements, milestones)
 */
export type OpenAIVoice = 
  | "alloy"   // Neutral, versatile
  | "ash"     // Subtle, calm
  | "ballad"  // Expressive, melodic
  | "coral"   // Bright, engaging
  | "echo"    // Resonant, clear
  | "fable"   // Soft, narrative
  | "nova"    // Crisp, modern
  | "onyx"    // Deep, rich, commanding (PRIMARY)
  | "sage"    // Wise, measured
  | "shimmer"; // Vibrant, dynamic

/**
 * TTS Provider abstraction for future extensibility
 */
export type TTSProvider = "openai" | "elevenlabs" | "respeacher";

/**
 * OpenAI TTS model options
 * - tts-1: Standard quality, faster, lower cost
 * - tts-1-hd: Higher quality, slightly slower
 */
export type OpenAITTSModel = "tts-1" | "tts-1-hd";

/**
 * Audio output format options
 */
export type AudioFormat = "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm";

export interface TTSOptions {
  text: string;
  voice?: OpenAIVoice;
  model?: OpenAITTSModel;
  speed?: number; // 0.25 to 4.0
  format?: AudioFormat;
  provider?: TTSProvider;
  instructions?: string; // For advanced voice modulation (gpt-4o-mini-tts)
}

export interface TTSResponse {
  audioBase64: string;
  format: AudioFormat;
  duration?: number; // Estimated duration in seconds
  voice: OpenAIVoice;
  charactersUsed: number;
}

export interface TTSError {
  error: string;
  code: "TEXT_TOO_LONG" | "INVALID_VOICE" | "SERVICE_ERROR" | "RATE_LIMITED" | "QUOTA_EXCEEDED";
  details?: string;
}

export interface TTSStreamOptions extends TTSOptions {
  onChunk?: (chunk: Uint8Array) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_VOICE: OpenAIVoice = "onyx";
const DEFAULT_MODEL: OpenAITTSModel = "tts-1-hd"; // Higher quality for professional content
const DEFAULT_FORMAT: AudioFormat = "mp3";
const DEFAULT_SPEED = 1.0;
const MAX_TEXT_LENGTH = 4096; // OpenAI limit

/**
 * Voice characteristics for context-aware selection
 */
export const VOICE_PROFILES: Record<OpenAIVoice, {
  description: string;
  useCase: string[];
  tone: string;
}> = {
  alloy: {
    description: "Neutral and versatile",
    useCase: ["general", "narration"],
    tone: "balanced"
  },
  ash: {
    description: "Subtle and calm",
    useCase: ["meditation", "relaxation"],
    tone: "soothing"
  },
  ballad: {
    description: "Expressive and melodic",
    useCase: ["storytelling", "creative"],
    tone: "dramatic"
  },
  coral: {
    description: "Bright and engaging",
    useCase: ["marketing", "announcements"],
    tone: "energetic"
  },
  echo: {
    description: "Resonant and clear",
    useCase: ["presentations", "formal"],
    tone: "professional"
  },
  fable: {
    description: "Soft and narrative",
    useCase: ["stories", "children"],
    tone: "gentle"
  },
  nova: {
    description: "Crisp and modern",
    useCase: ["tutorials", "professional"],
    tone: "friendly"
  },
  onyx: {
    description: "Deep, rich, and commanding",
    useCase: ["empowerment", "motivation", "business", "feedback"],
    tone: "authoritative"
  },
  sage: {
    description: "Wise and measured",
    useCase: ["advice", "mentoring"],
    tone: "thoughtful"
  },
  shimmer: {
    description: "Vibrant and dynamic",
    useCase: ["celebrations", "achievements"],
    tone: "exciting"
  }
};

/**
 * Context-based voice recommendations for NuFounders
 */
export const CONTEXT_VOICE_MAP: Record<string, OpenAIVoice> = {
  course_lesson: "onyx",      // Authoritative teaching
  course_intro: "nova",       // Welcoming
  feedback_positive: "shimmer", // Celebratory
  feedback_constructive: "onyx", // Supportive but serious
  success_story: "onyx",      // Inspiring
  dashboard_greeting: "nova", // Friendly daily hello
  achievement_unlocked: "shimmer", // Celebration
  pitch_feedback: "sage",     // Mentoring tone
  onboarding: "nova",         // Welcoming newcomers
  encouragement: "onyx",      // Motivational
};

// ============================================================================
// MAIN TTS FUNCTION
// ============================================================================

/**
 * Synthesize text to speech using OpenAI TTS API
 * 
 * @param options - TTS configuration
 * @returns Audio data as base64 or error
 */
export async function synthesizeSpeech(
  options: TTSOptions
): Promise<TTSResponse | TTSError> {
  const {
    text,
    voice = DEFAULT_VOICE,
    model = DEFAULT_MODEL,
    speed = DEFAULT_SPEED,
    format = DEFAULT_FORMAT,
    provider = "openai",
  } = options;

  // Validate input
  if (!text || text.trim().length === 0) {
    return {
      error: "Text cannot be empty",
      code: "SERVICE_ERROR",
      details: "Please provide text to synthesize"
    };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return {
      error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
      code: "TEXT_TOO_LONG",
      details: `Your text is ${text.length} characters. Consider breaking it into smaller chunks.`
    };
  }

  if (speed < 0.25 || speed > 4.0) {
    return {
      error: "Speed must be between 0.25 and 4.0",
      code: "SERVICE_ERROR",
      details: `Provided speed: ${speed}`
    };
  }

  // Route to appropriate provider
  switch (provider) {
    case "openai":
      return synthesizeWithOpenAI({ text, voice, model, speed, format });
    case "elevenlabs":
      return {
        error: "ElevenLabs provider not yet implemented",
        code: "SERVICE_ERROR",
        details: "Coming soon - use OpenAI for now"
      };
    case "respeacher":
      return {
        error: "Respeacher provider not yet implemented",
        code: "SERVICE_ERROR",
        details: "Coming soon - use OpenAI for now"
      };
    default:
      return {
        error: `Unknown TTS provider: ${provider}`,
        code: "SERVICE_ERROR"
      };
  }
}

/**
 * OpenAI-specific TTS implementation
 */
async function synthesizeWithOpenAI(options: {
  text: string;
  voice: OpenAIVoice;
  model: OpenAITTSModel;
  speed: number;
  format: AudioFormat;
}): Promise<TTSResponse | TTSError> {
  const { text, voice, model, speed, format } = options;

  // Check API configuration
  if (!ENV.openaiApiKey) {
    return {
      error: "OpenAI API key not configured",
      code: "SERVICE_ERROR",
      details: "Set OPENAI_API in your environment variables"
    };
  }

  try {
    const apiUrl = ENV.openaiApiUrl || "https://api.openai.com/v1";
    const endpoint = `${apiUrl.replace(/\/$/, "")}/audio/speech`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        speed,
        response_format: format,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      
      if (response.status === 429) {
        return {
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
          details: "Please wait a moment and try again"
        };
      }
      
      if (response.status === 402) {
        return {
          error: "API quota exceeded",
          code: "QUOTA_EXCEEDED",
          details: "Please check your OpenAI billing settings"
        };
      }

      return {
        error: "TTS API request failed",
        code: "SERVICE_ERROR",
        details: `${response.status} ${response.statusText}${errorBody ? `: ${errorBody}` : ""}`
      };
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    // Estimate duration (rough: ~150 words/minute, ~5 chars/word)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60 / speed;

    return {
      audioBase64,
      format,
      duration: Math.round(estimatedDuration),
      voice,
      charactersUsed: text.length,
    };
  } catch (error) {
    return {
      error: "Failed to synthesize speech",
      code: "SERVICE_ERROR",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the recommended voice for a specific context
 */
export function getVoiceForContext(context: keyof typeof CONTEXT_VOICE_MAP): OpenAIVoice {
  return CONTEXT_VOICE_MAP[context] || DEFAULT_VOICE;
}

/**
 * Split long text into TTS-friendly chunks
 * Respects sentence boundaries for natural speech
 */
export function splitTextForTTS(text: string, maxLength = MAX_TEXT_LENGTH): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // If single sentence is too long, split by comma or space
      if (sentence.length > maxLength) {
        const subChunks = sentence.match(new RegExp(`.{1,${maxLength}}(?:\\s|$)`, 'g')) || [sentence];
        chunks.push(...subChunks.map(c => c.trim()));
        currentChunk = "";
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Synthesize long text by chunking and concatenating
 */
export async function synthesizeLongText(
  text: string,
  options: Omit<TTSOptions, "text"> = {}
): Promise<TTSResponse | TTSError> {
  const chunks = splitTextForTTS(text);
  
  if (chunks.length === 1) {
    return synthesizeSpeech({ ...options, text: chunks[0] });
  }

  const results: TTSResponse[] = [];
  
  for (const chunk of chunks) {
    const result = await synthesizeSpeech({ ...options, text: chunk });
    if ("error" in result) {
      return result; // Return first error
    }
    results.push(result);
  }

  // Concatenate base64 audio (simplified - in production use proper audio concatenation)
  // For now, return first chunk with total stats
  return {
    audioBase64: results.map(r => r.audioBase64).join(""), // Note: This is simplified
    format: results[0].format,
    duration: results.reduce((sum, r) => sum + (r.duration || 0), 0),
    voice: results[0].voice,
    charactersUsed: text.length,
  };
}

/**
 * Get cost estimate for TTS (OpenAI pricing: $0.015 per 1K chars for tts-1, $0.030 for tts-1-hd)
 */
export function estimateTTSCost(text: string, model: OpenAITTSModel = "tts-1-hd"): number {
  const ratePerThousand = model === "tts-1-hd" ? 0.030 : 0.015;
  return (text.length / 1000) * ratePerThousand;
}

// ============================================================================
// CONTEXTUAL TTS HELPERS FOR NUFOUNDERS
// ============================================================================

/**
 * Generate empowering greeting for dashboard
 */
export async function generateDashboardGreeting(userName: string): Promise<TTSResponse | TTSError> {
  const greetings = [
    `Welcome back, ${userName}. Your entrepreneurship journey continues today.`,
    `Hello, ${userName}. Every step you take brings you closer to your goals.`,
    `Good to see you, ${userName}. Let's make today count.`,
    `${userName}, you're building something amazing. Let's keep moving forward.`,
  ];
  
  const text = greetings[Math.floor(Math.random() * greetings.length)];
  
  return synthesizeSpeech({
    text,
    voice: getVoiceForContext("dashboard_greeting"),
    speed: 0.95, // Slightly slower for warmth
  });
}

/**
 * Generate celebratory message for achievements
 */
export async function celebrateAchievement(achievementTitle: string): Promise<TTSResponse | TTSError> {
  const text = `Congratulations! You've just unlocked the ${achievementTitle} achievement. Your dedication is truly inspiring. Keep pushing forward!`;
  
  return synthesizeSpeech({
    text,
    voice: getVoiceForContext("achievement_unlocked"),
    speed: 1.05, // Slightly faster for excitement
  });
}

/**
 * Narrate course lesson content
 */
export async function narrateCourseContent(content: string): Promise<TTSResponse | TTSError> {
  return synthesizeLongText(content, {
    voice: getVoiceForContext("course_lesson"),
    speed: 0.9, // Slower for learning
    model: "tts-1-hd", // Higher quality for educational content
  });
}

/**
 * Read AI feedback on documents/pitches
 */
export async function readFeedback(
  feedback: string,
  isPositive: boolean
): Promise<TTSResponse | TTSError> {
  const voice = isPositive 
    ? getVoiceForContext("feedback_positive")
    : getVoiceForContext("feedback_constructive");
  
  return synthesizeSpeech({
    text: feedback,
    voice,
    speed: 0.95,
  });
}
