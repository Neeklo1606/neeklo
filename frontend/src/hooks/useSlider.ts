import { useState, useRef, useCallback, useEffect } from 'react';
import { useMotionValue, useSpring, PanInfo } from 'framer-motion';

const CARD_WIDTH_MOBILE = 240;
const CARD_WIDTH_DESKTOP = 300;
const CARD_GAP = 16;

interface UseSliderOptions {
  containerRef: React.RefObject<HTMLDivElement>;
  sliderRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  itemCount: number;
  onDragStart?: () => void;
}

export function useSlider({
  containerRef,
  sliderRef,
  isMobile,
  itemCount,
  onDragStart,
}: UseSliderOptions) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Internal refs — not attached to DOM, safe to create inside hook
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const springConfig = isMobile
    ? { stiffness: 200, damping: 30, mass: 0.8 }
    : { stiffness: 300, damping: 35, mass: 0.5 };

  const x = useMotionValue(0);
  const springX = useSpring(x, springConfig);

  const maxDrag = Math.min(0, containerWidth - sliderWidth - 32);

  // Dimension measurement — uses the refs passed in from the component
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && sliderRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setSliderWidth(sliderRef.current.scrollWidth);
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerRef, sliderRef, itemCount]);

  // Subscribe to x changes to update scroll indicators
  useEffect(() => {
    const update = () => {
      const currentX = x.get();
      setCanScrollLeft(currentX < -10);
      setCanScrollRight(currentX > maxDrag + 10);
    };
    const unsubscribe = x.on('change', update);
    update();
    return () => unsubscribe();
  }, [x, maxDrag]);

  const handleDragStart = useCallback((_: unknown, info: PanInfo) => {
    isDraggingRef.current = true;
    hasDragged.current = false;
    dragStartPos.current = { x: info.point.x, y: info.point.y };
    onDragStart?.();
  }, [onDragStart]);

  const handleDrag = useCallback((_: unknown, info: PanInfo) => {
    const dx = Math.abs(info.point.x - dragStartPos.current.x);
    const dy = Math.abs(info.point.y - dragStartPos.current.y);
    if (dx > 5 || dy > 5) hasDragged.current = true;
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    isDraggingRef.current = false;
    const currentX = x.get();
    const inertiaMultiplier = isMobile ? 0.5 : 0.35;
    let targetX = currentX + info.velocity.x * inertiaMultiplier;
    targetX = Math.max(maxDrag, Math.min(0, targetX));
    x.set(targetX);
    setTimeout(() => { hasDragged.current = false; }, 50);
  }, [x, maxDrag, isMobile]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const scrollLeft = useCallback(() => {
    const scrollAmount = (isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP) + CARD_GAP;
    x.set(Math.min(0, x.get() + scrollAmount * 2));
  }, [x, isMobile]);

  const scrollRight = useCallback(() => {
    const scrollAmount = (isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP) + CARD_GAP;
    x.set(Math.max(maxDrag, x.get() - scrollAmount * 2));
  }, [x, maxDrag, isMobile]);

  return {
    x,
    springX,
    maxDrag,
    canScrollLeft,
    canScrollRight,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleCardClick,
    scrollLeft,
    scrollRight,
  };
}
