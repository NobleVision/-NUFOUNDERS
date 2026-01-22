/**
 * React hook for Text-to-Speech functionality
 * 
 * Provides easy-to-use TTS capabilities with:
 * - Audio playback controls (play, pause, stop)
 * - Loading and error states
 * - Queue management for multiple TTS requests
 * - Voice selection with context-aware defaults
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export type TTSVoice = 
  | "alloy" | "ash" | "ballad" | "coral" | "echo" 
  | "fable" | "nova" | "onyx" | "sage" | "shimmer";

export type TTSContext = 
  | "course_lesson"
  | "course_intro"
  | "feedback_positive"
  | "feedback_constructive"
  | "success_story"
  | "dashboard_greeting"
  | "achievement_unlocked"
  | "pitch_feedback"
  | "onboarding"
  | "encouragement";

interface TTSOptions {
  voice?: TTSVoice;
  speed?: number;
  context?: TTSContext;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  error: string | null;
  currentText: string | null;
  progress: number;
  duration: number;
}

const CONTEXT_VOICE_MAP: Record<TTSContext, TTSVoice> = {
  course_lesson: "onyx",
  course_intro: "nova",
  feedback_positive: "shimmer",
  feedback_constructive: "onyx",
  success_story: "onyx",
  dashboard_greeting: "nova",
  achievement_unlocked: "shimmer",
  pitch_feedback: "sage",
  onboarding: "nova",
  encouragement: "onyx",
};

export function useTextToSpeech(defaultOptions: TTSOptions = {}) {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    isPaused: false,
    error: null,
    currentText: null,
    progress: 0,
    duration: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // tRPC mutation for TTS
  const ttsMutation = trpc.voice.synthesize.useMutation();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const getVoiceForContext = useCallback((context?: TTSContext): TTSVoice => {
    if (context && CONTEXT_VOICE_MAP[context]) {
      return CONTEXT_VOICE_MAP[context];
    }
    return defaultOptions.voice || "onyx";
  }, [defaultOptions.voice]);

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    const mergedOptions = { ...defaultOptions, ...options };
    const voice = mergedOptions.voice || getVoiceForContext(mergedOptions.context);
    const speed = mergedOptions.speed || 1.0;

    // Stop any existing playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      currentText: text,
      isPlaying: false,
      isPaused: false,
      progress: 0,
    }));

    try {
      const result = await ttsMutation.mutateAsync({
        text,
        voice,
        speed,
      });

      if ("error" in result) {
        throw new Error(String(result.error));
      }

      // Create audio element from base64
      const audioUrl = `data:audio/mp3;base64,${result.audioBase64}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      audio.onloadedmetadata = () => {
        setState(prev => ({
          ...prev,
          duration: audio.duration,
        }));
      };

      audio.onplay = () => {
        setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        mergedOptions.onStart?.();

        // Start progress tracking
        progressIntervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            setState(prev => ({
              ...prev,
              progress: (audioRef.current!.currentTime / audioRef.current!.duration) * 100,
            }));
          }
        }, 100);
      };

      audio.onpause = () => {
        setState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
      };

      audio.onended = () => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          progress: 100,
        }));
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        mergedOptions.onEnd?.();
      };

      audio.onerror = () => {
        const errorMsg = "Failed to play audio";
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
          isPlaying: false,
        }));
        mergedOptions.onError?.(errorMsg);
      };

      setState(prev => ({ ...prev, isLoading: false }));
      await audio.play();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "TTS failed";
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
        isPlaying: false,
      }));
      mergedOptions.onError?.(errorMsg);
    }
  }, [defaultOptions, getVoiceForContext, ttsMutation]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      progress: 0,
      currentText: null,
    }));
  }, []);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.isPaused && audioRef.current) {
      resume();
    }
  }, [state.isPlaying, state.isPaused, pause, resume]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const seek = useCallback((progress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (progress / 100) * audioRef.current.duration;
      setState(prev => ({ ...prev, progress }));
    }
  }, []);

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setVolume,
    seek,
    isMutationLoading: ttsMutation.isPending,
  };
}

export default useTextToSpeech;
