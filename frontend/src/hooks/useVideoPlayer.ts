import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVideoPlayerOptions {
  src: string;
  autoPlay?: boolean;
  priority?: boolean;
}

export function useVideoPlayer({ src, autoPlay = false, priority = false }: UseVideoPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority, isInView]);

  useEffect(() => {
    if (!isInView || !videoRef.current) return;
    const video = videoRef.current;
    if (!video.src && src) {
      video.src = src;
      video.load();
    }
  }, [isInView, src]);

  useEffect(() => {
    if (!autoPlay || !isInView || !videoRef.current || !isLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        } else if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [autoPlay, isInView, isLoaded]);

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    resetControlsTimeout();
  }, [isPlaying, resetControlsTimeout]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    videoRef.current.currentTime =
      ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleMouseEnter = useCallback(() => setShowControls(true), []);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) setShowControls(false);
  }, [isPlaying]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  return {
    videoRef,
    containerRef,
    isPlaying,
    isMuted,
    isFullscreen,
    isLoading,
    isLoaded,
    showControls,
    progress,
    isInView,
    hasError,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleTimeUpdate,
    handleSeek,
    handleLoaded,
    handleError,
    resetControlsTimeout,
    handleMouseEnter,
    handleMouseLeave,
    handlePlay,
    handlePause,
  };
}
