import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2 className={cn("text-2xl font-heading font-bold text-foreground mb-4", className)}>
      {children}
    </h2>
  );
}
