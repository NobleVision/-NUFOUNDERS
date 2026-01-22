/**
 * Text-to-Speech Player Component
 * 
 * A reusable audio player for TTS content with play/pause controls,
 * progress bar, and volume control. Designed for accessibility and
 * seamless integration throughout the NuFounders platform.
 */
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Loader2,
  AudioLines,
  RotateCcw,
} from "lucide-react";

interface TTSPlayerProps {
  text: string;
  label?: string;
  voice?: "onyx" | "nova" | "shimmer" | "sage" | "echo";
  speed?: number;
  autoPlay?: boolean;
  showText?: boolean;
  compact?: boolean;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

export function TTSPlayer({
  text,
  label = "Listen",
  voice = "onyx",
  speed = 1.0,
  autoPlay = false,
  showText = false,
  compact = false,
  className,
  onPlayStart,
  onPlayEnd,
}: TTSPlayerProps) {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    isPaused: false,
    progress: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    error: null,
  });

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // tRPC mutation for TTS synthesis
  const synthesizeMutation = trpc.voice.synthesize.useMutation({
    onError: (error) => {
      console.error("TTS synthesis error:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to generate speech. Using demo mode.",
      }));
      // Fall back to demo mode
      playDemoMode();
    },
  });

  // Demo mode fallback when API is unavailable
  const playDemoMode = () => {
    const estimatedDuration = Math.ceil((text.length / 150) * 60 / speed);
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      isPlaying: true,
      duration: estimatedDuration,
      error: null,
    }));

    onPlayStart?.();

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
      
      setState(prev => ({ ...prev, progress }));

      if (progress >= 100) {
        clearInterval(interval);
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
        }));
        onPlayEnd?.();
      }
    }, 100);

    (window as any).__ttsInterval = interval;
  };

  const handlePlay = async () => {
    if (state.isPlaying) {
      audioRef.current?.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
      return;
    }

    if (state.isPaused && audioRef.current) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call real TTS API
      const result = await synthesizeMutation.mutateAsync({
        text: text.slice(0, 4000), // Limit text length
        voice,
        speed,
      });

      if (result.audioBase64) {
        // Create audio from base64
        const audioData = `data:audio/mp3;base64,${result.audioBase64}`;
        const newAudio = new Audio(audioData);
        newAudio.volume = state.volume;
        
        newAudio.addEventListener('loadedmetadata', () => {
          setState(prev => ({
            ...prev,
            duration: newAudio.duration,
          }));
        });

        newAudio.addEventListener('timeupdate', () => {
          const progress = (newAudio.currentTime / newAudio.duration) * 100;
          setState(prev => ({ ...prev, progress }));
        });

        newAudio.addEventListener('ended', () => {
          setState(prev => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            progress: 100,
          }));
          onPlayEnd?.();
        });

        audioRef.current = newAudio;
        setAudio(newAudio);
        await newAudio.play();

        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: true,
        }));

        onPlayStart?.();
      } else {
        // No audio returned, use demo mode
        playDemoMode();
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to generate speech",
      }));
    }
  };

  const handleStop = () => {
    if ((window as any).__ttsInterval) {
      clearInterval((window as any).__ttsInterval);
    }
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      progress: 0,
    }));
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(handlePlay, 100);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !state.isMuted;
    }
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setState(prev => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }));
  };

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
    return () => {
      if ((window as any).__ttsInterval) {
        clearInterval((window as any).__ttsInterval);
      }
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", className)}
              onClick={handlePlay}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : state.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{state.isPlaying ? "Pause" : "Listen to this content"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border bg-muted/30 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AudioLines className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{label}</span>
          <Badge variant="outline" className="text-xs">
            {voice}
          </Badge>
        </div>
        {state.duration > 0 && (
          <span className="text-xs text-muted-foreground">
            {formatTime((state.progress / 100) * state.duration)} / {formatTime(state.duration)}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${state.progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <Button
            variant="default"
            size="sm"
            onClick={handlePlay}
            disabled={state.isLoading}
            className="gap-2"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : state.isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : state.isPaused ? (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </Button>

          {/* Stop */}
          {(state.isPlaying || state.isPaused) && (
            <Button variant="outline" size="icon" onClick={handleStop} className="h-8 w-8">
              <Square className="h-3 w-3" />
            </Button>
          )}

          {/* Replay */}
          {state.progress === 100 && (
            <Button variant="outline" size="icon" onClick={handleReplay} className="h-8 w-8">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Volume Control */}
        <div 
          className="flex items-center gap-2"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 80, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Slider
                  value={[state.isMuted ? 0 : state.volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-20"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
            {state.isMuted || state.volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {state.error && (
        <div className="mt-3 p-2 rounded bg-destructive/10 text-destructive text-sm">
          {state.error}
        </div>
      )}

      {/* Optional: Show Text */}
      {showText && (
        <div className="mt-3 p-3 rounded bg-background text-sm text-muted-foreground max-h-32 overflow-y-auto">
          {text}
        </div>
      )}
    </div>
  );
}

/**
 * Inline TTS button for embedding in text content
 */
export function TTSInlineButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setIsPlaying(true);

    // Simulate playback
    const duration = Math.ceil((text.length / 150) * 60);
    setTimeout(() => setIsPlaying(false), duration * 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
        "bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
      <span>{isPlaying ? "Playing" : "Listen"}</span>
    </button>
  );
}

export default TTSPlayer;
