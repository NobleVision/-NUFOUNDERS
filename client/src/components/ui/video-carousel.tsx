import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCarouselProps {
  videos: string[];
  interval?: number;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

type TransitionType = "fade" | "slide" | "zoom" | "blur" | "crossfade";
type KenBurnsType = "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "panUp" | "panDown";

const TRANSITION_TYPES: TransitionType[] = ["fade", "slide", "zoom", "blur", "crossfade"];
const KEN_BURNS_EFFECTS: KenBurnsType[] = ["zoomIn", "zoomOut", "panLeft", "panRight", "panUp", "panDown"];

const getRandomTransition = (): TransitionType => {
  return TRANSITION_TYPES[Math.floor(Math.random() * TRANSITION_TYPES.length)];
};

const getRandomKenBurns = (): KenBurnsType => {
  return KEN_BURNS_EFFECTS[Math.floor(Math.random() * KEN_BURNS_EFFECTS.length)];
};

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  zoom: {
    initial: { opacity: 0, scale: 1.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(20px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(20px)" },
  },
  crossfade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

const kenBurnsVariants = {
  zoomIn: {
    initial: { scale: 1, x: 0, y: 0 },
    animate: { scale: 1.15, x: 0, y: 0 },
  },
  zoomOut: {
    initial: { scale: 1.15, x: 0, y: 0 },
    animate: { scale: 1, x: 0, y: 0 },
  },
  panLeft: {
    initial: { scale: 1.1, x: "5%", y: 0 },
    animate: { scale: 1.1, x: "-5%", y: 0 },
  },
  panRight: {
    initial: { scale: 1.1, x: "-5%", y: 0 },
    animate: { scale: 1.1, x: "5%", y: 0 },
  },
  panUp: {
    initial: { scale: 1.1, x: 0, y: "3%" },
    animate: { scale: 1.1, x: 0, y: "-3%" },
  },
  panDown: {
    initial: { scale: 1.1, x: 0, y: "-3%" },
    animate: { scale: 1.1, x: 0, y: "3%" },
  },
} as const;

export function VideoCarousel({
  videos,
  interval = 10000,
  className = "",
  overlayClassName = "",
  children,
}: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transition, setTransition] = useState<TransitionType>("fade");
  const [kenBurns, setKenBurns] = useState<KenBurnsType>("zoomIn");
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const [hasError, setHasError] = useState<Set<number>>(new Set());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const preloadVideo = useCallback((index: number) => {
    if (videos[index] && !loadedVideos.has(index)) {
      const video = document.createElement("video");
      video.src = videos[index];
      video.preload = "auto";
      video.oncanplaythrough = () => {
        setLoadedVideos((prev) => new Set(prev).add(index));
      };
      video.onerror = () => {
        setHasError((prev) => new Set(prev).add(index));
      };
    }
  }, [videos, loadedVideos]);

  const goToNext = useCallback(() => {
    setTransition(getRandomTransition());
    setKenBurns(getRandomKenBurns());
    setCurrentIndex((prev) => {
      let next = (prev + 1) % videos.length;
      while (hasError.has(next) && next !== prev) {
        next = (next + 1) % videos.length;
      }
      return next;
    });
  }, [videos.length, hasError]);

  useEffect(() => {
    if (videos.length === 0) return;

    preloadVideo(0);
    preloadVideo(1);

    intervalRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videos.length, interval, goToNext, preloadVideo]);

  useEffect(() => {
    const nextIndex = (currentIndex + 1) % videos.length;
    const nextNextIndex = (currentIndex + 2) % videos.length;
    preloadVideo(nextIndex);
    preloadVideo(nextNextIndex);
  }, [currentIndex, videos.length, preloadVideo]);

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleVideoError = useCallback((index: number) => {
    setHasError((prev) => new Set(prev).add(index));
    if (hasError.size < videos.length - 1) {
      goToNext();
    }
  }, [hasError.size, videos.length, goToNext]);

  if (videos.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 ${className}`}>
        <div className={`absolute inset-0 ${overlayClassName}`} />
        {children}
      </div>
    );
  }

  const validVideos = videos.filter((_, i) => !hasError.has(i));
  if (validVideos.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 ${className}`}>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, hsl(var(--primary)/0.3) 0%, hsl(var(--background)) 50%, hsl(var(--accent)/0.3) 100%)",
              "linear-gradient(135deg, hsl(var(--accent)/0.3) 0%, hsl(var(--background)) 50%, hsl(var(--primary)/0.3) 100%)",
              "linear-gradient(135deg, hsl(var(--primary)/0.3) 0%, hsl(var(--background)) 50%, hsl(var(--accent)/0.3) 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <div className={`absolute inset-0 ${overlayClassName}`} />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          variants={transitionVariants[transition]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={kenBurnsVariants[kenBurns].initial}
            animate={kenBurnsVariants[kenBurns].animate}
            transition={{ duration: interval / 1000, ease: "linear" }}
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(currentIndex, el);
              }}
              key={videos[currentIndex]}
              src={videos[currentIndex]}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={handleVideoLoad}
              onError={() => handleVideoError(currentIndex)}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.5s ease-in-out"
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 ${overlayClassName}`} />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, hsl(var(--primary)/0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 50%, hsl(var(--primary)/0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, hsl(var(--primary)/0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {videos.map((_, index) => (
          !hasError.has(index) && (
            <motion.button
              key={index}
              onClick={() => {
                setTransition(getRandomTransition());
                setKenBurns(getRandomKenBurns());
                setCurrentIndex(index);
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = setInterval(goToNext, interval);
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "w-8 bg-white" 
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to video ${index + 1}`}
            />
          )
        ))}
      </div>

      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: interval / 1000, ease: "linear" }}
        key={currentIndex}
        style={{ transformOrigin: "left" }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-white to-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: "linear" }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function useVideoList(basePath: string = "/videos"): string[] {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const videoFiles = [
      "hero-1.mp4",
      "hero-2.mp4",
      "hero-3.mp4",
      "hero-4.mp4",
      "hero-5.mp4",
      "entrepreneur-1.mp4",
      "entrepreneur-2.mp4",
      "success-1.mp4",
      "success-2.mp4",
      "community-1.mp4",
    ];

    const videoPaths = videoFiles.map((file) => `${basePath}/${file}`);
    
    const checkVideos = async () => {
      const validVideos: string[] = [];
      for (const path of videoPaths) {
        try {
          const response = await fetch(path, { method: "HEAD" });
          if (response.ok) {
            validVideos.push(path);
          }
        } catch {
          // Video doesn't exist, skip it
        }
      }
      
      if (validVideos.length > 0) {
        setVideos(validVideos);
      }
    };

    checkVideos();
  }, [basePath]);

  return videos;
}

export default VideoCarousel;
