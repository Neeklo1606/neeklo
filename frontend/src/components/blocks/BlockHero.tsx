import { HeroMinimal } from "@/components/hero/HeroMinimal";
import type { CmsBlock } from "./BlockRenderer";

interface HeroData {
  variant?: string;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  scroll_target?: string;
  eyebrow?: string;
  cta_primary?: string;
  cta_secondary?: string;
  video_src?: string;
  poster_src?: string;
}

/** Всегда новый светлый hero (HeroMinimal). Старые поля (cta_text, scroll_target) маппятся в новые. Отступ 48px до следующего блока. */
export function BlockHero({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as HeroData;
  return (
    <div className="mb-12">
    <HeroMinimal
      title={d.title}
      subtitle={d.subtitle}
      eyebrow={d.eyebrow}
      ctaPrimary={d.cta_primary ?? d.cta_text}
      ctaSecondary={d.cta_secondary}
      scrollTargetId={d.scroll_target || "contact"}
      videoSrc={d.video_src}
      posterSrc={d.poster_src}
    />
    </div>
  );
}
