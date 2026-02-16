import { HeroSection } from "@/components/hero/HeroSection";
import type { CmsBlock } from "./BlockRenderer";

interface HeroData {
  title?: string;
  subtitle?: string;
  cta_text?: string;
  scroll_target?: string;
}

export function BlockHero({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as HeroData;
  return (
    <HeroSection
      title={d.title}
      subtitle={d.subtitle}
      ctaText={d.cta_text}
      scrollTarget={d.scroll_target}
    />
  );
}
