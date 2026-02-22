import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const SectionTitle = ({
  title,
  subtitle,
  align = "left",
  className,
  ...props
}: SectionTitleProps) => {
  const alignmentClass = align === "center" ? "text-center mx-auto" : "text-left";

  const MotionDiv = motion.div as any;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("mb-14 md:mb-16", alignmentClass, className)}
      {...props}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-base md:text-lg lg:text-xl text-foreground/70 max-w-2xl leading-relaxed", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </MotionDiv>
  );
};
