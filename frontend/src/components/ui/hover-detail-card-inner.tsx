import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface HoverDetailCardInnerProps {
  title: string;
  subtitle: string;
  displayImages: string[];
  videoUrl?: string;
  hideOverlayOnMobile: boolean;
  singleButton: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  shouldAnimate: boolean;
  primaryBtnClass: string;
  secondaryBtnClass: string;
  cardClassName: string;
  primaryButton: { text: string; href?: string };
  secondaryButton: { text: string; href?: string };
  pills: {
    left: { text: string; color?: string; textColor?: string };
    sparkle?: { show: boolean; color?: string };
    right: { text: string; color?: string; textColor?: string };
  };
  containerVariants: Variants;
  imageVariants: Variants;
  contentVariants: Variants;
  bottomSectionVariants: Variants;
  pillVariants: Variants;
  textVariants: Variants;
}

export function HoverDetailCardInner(props: HoverDetailCardInnerProps) {
  const {
    title,
    subtitle,
    displayImages,
    videoUrl,
    hideOverlayOnMobile,
    singleButton,
    isHovered,
    onHoverStart,
    onHoverEnd,
    shouldAnimate,
    primaryBtnClass,
    secondaryBtnClass,
    cardClassName,
    primaryButton,
    secondaryButton,
    pills,
    containerVariants,
    imageVariants,
    contentVariants,
    bottomSectionVariants,
    pillVariants,
    textVariants,
  } = props;

  return (
    <motion.div
      className={cardClassName}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <motion.div
        className="bg-muted p-3 sm:p-4 border-b border-border/50 relative"
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        variants={shouldAnimate ? contentVariants : {}}
      >
        <div className="grid grid-cols-5 gap-2 relative">
          {displayImages.map((src, index) => (
            <motion.div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg"
              variants={shouldAnimate ? imageVariants : {}}
              animate={{ scale: isHovered ? 0.85 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <img
                src={src}
                alt={`${title} ${index + 1}`}
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4",
                hideOverlayOnMobile && "max-md:!hidden"
              )}
            >
              {videoUrl && (
                <motion.video
                  src={videoUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[120px] w-auto rounded-lg object-contain shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <div className="flex gap-3 mx-auto">
                {primaryButton.href ? (
                  <Link to={primaryButton.href} className={primaryBtnClass}>
                    <motion.span
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
                    >
                      {primaryButton.text}
                    </motion.span>
                  </Link>
                ) : (
                  <motion.button
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
                    className={primaryBtnClass}
                  >
                    {primaryButton.text}
                  </motion.button>
                )}
                {!singleButton && secondaryButton && (
                  secondaryButton.href ? (
                    <Link to={secondaryButton.href} className={secondaryBtnClass}>
                      <motion.span
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
                      >
                        {secondaryButton.text}
                      </motion.span>
                    </Link>
                  ) : (
                    <motion.button
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
                      className={secondaryBtnClass}
                    >
                      {secondaryButton.text}
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="p-4"
        variants={shouldAnimate ? bottomSectionVariants : {}}
      >
        <motion.div
          className="flex items-center justify-between mb-3"
          variants={shouldAnimate ? contentVariants : {}}
        >
          <motion.div
            className="flex items-center gap-2"
            variants={shouldAnimate ? bottomSectionVariants : {}}
          >
            <motion.div
              className={`${pills.left.color} ${pills.left.textColor} px-3 py-1 rounded-full text-sm font-medium`}
              variants={shouldAnimate ? pillVariants : {}}
            >
              {pills.left.text}
            </motion.div>
            {pills.sparkle?.show && (
              <motion.div
                className={`${pills.sparkle.color} p-2 rounded-full`}
                variants={shouldAnimate ? pillVariants : {}}
                whileHover={
                  shouldAnimate
                    ? { rotate: 15, scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 25 } }
                    : {}
                }
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            )}
          </motion.div>
          <motion.div
            className={`${pills.right.color} ${pills.right.textColor} px-3 py-1 rounded-full text-sm font-medium`}
            variants={shouldAnimate ? pillVariants : {}}
          >
            {pills.right.text}
          </motion.div>
        </motion.div>

        <motion.div variants={shouldAnimate ? bottomSectionVariants : {}}>
          <motion.h3
            className="text-xl font-bold text-foreground mb-1"
            variants={shouldAnimate ? textVariants : {}}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-muted-foreground text-sm line-clamp-2"
            variants={shouldAnimate ? textVariants : {}}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
