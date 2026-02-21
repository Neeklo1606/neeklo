import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HoverDetailCardInner } from "./hover-detail-card-inner";

export interface HoverDetailCardProps {
  title?: string;
  subtitle?: string;
  images?: string[];
  /** URL видео — показывается в оверлее при наведении */
  videoUrl?: string;
  /** Если задан — вся карточка кликабельна (Link) */
  cardHref?: string;
  /** Скрыть оверлей с кнопками на мобильных */
  hideOverlayOnMobile?: boolean;
  /** Показать только одну кнопку (primary) в оверлее */
  singleButton?: boolean;
  primaryButton?: {
    text: string;
    href?: string;
    color?: string;
    hoverColor?: string;
    textColor?: string;
  };
  secondaryButton?: {
    text: string;
    href?: string;
    color?: string;
    hoverColor?: string;
    textColor?: string;
  };
  pills?: {
    left: {
      text: string;
      color?: string;
      textColor?: string;
    };
    sparkle?: {
      show: boolean;
      color?: string;
    };
    right: {
      text: string;
      color?: string;
      textColor?: string;
    };
  };
  enableAnimations?: boolean;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&flip=h",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop&flip=h",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop&sat=-100",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop&flip=h",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&sat=-50",
];

export function HoverDetailCard({
  title = "Studio shots",
  subtitle = "52 tiles",
  images = defaultImages,
  videoUrl,
  cardHref,
  hideOverlayOnMobile = false,
  singleButton = false,
  primaryButton = {
    text: "Go to collection",
    color: "bg-white/90",
    hoverColor: "hover:bg-white",
    textColor: "text-gray-900",
  },
  secondaryButton = {
    text: "Edit rules",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    textColor: "text-white",
  },
  pills = {
    left: { text: "1×1", color: "bg-blue-100", textColor: "text-blue-800" },
    sparkle: { show: true, color: "bg-purple-100 text-purple-800" },
    right: { text: "Published", color: "bg-green-100", textColor: "text-green-800" },
  },
  enableAnimations = true,
}: HoverDetailCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: -25,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
      },
    },
  };

  const bottomSectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      },
    },
  };

  const pillVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 25,
        mass: 0.5,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 15,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.7,
      },
    },
  };

  const displayImages = images.slice(0, 10).length ? images.slice(0, 10) : defaultImages.slice(0, 10);
  const primaryBtnClass = `${primaryButton.color} ${primaryButton.hoverColor} ${primaryButton.textColor} cursor-pointer px-3 py-1.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200`;
  const secondaryBtnClass = `${secondaryButton.color} ${secondaryButton.hoverColor} ${secondaryButton.textColor} cursor-pointer px-3 py-1.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200`;

  const cardClassName = "bg-card border border-border/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col";
  const wrapperClass = "block w-full max-w-md flex-shrink-0";

  const innerProps = {
    title,
    subtitle,
    displayImages,
    videoUrl,
    hideOverlayOnMobile,
    singleButton,
    isHovered,
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    shouldAnimate,
    primaryBtnClass,
    secondaryBtnClass,
    cardClassName,
    primaryButton: { text: primaryButton.text, href: primaryButton.href },
    secondaryButton: { text: secondaryButton.text, href: secondaryButton.href },
    pills,
    containerVariants,
    imageVariants,
    contentVariants,
    bottomSectionVariants,
    pillVariants,
    textVariants,
  };

  if (cardHref) {
    return (
      <Link to={cardHref} className={wrapperClass}>
        <HoverDetailCardInner {...innerProps} />
      </Link>
    );
  }
  return (
    <div className={wrapperClass}>
      <HoverDetailCardInner {...innerProps} />
    </div>
  );
}
