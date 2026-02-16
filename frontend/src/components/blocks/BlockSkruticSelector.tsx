import { SkruticSelector } from "@/components/sections/SkruticSelector";
import type { CmsBlock } from "./BlockRenderer";

interface SkruticSelectorData {
  section_id?: string;
  steps?: Record<string, { title: string; options: string[] }>;
  telegram_link?: string;
}

export function BlockSkruticSelector({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as SkruticSelectorData;
  return (
    <section id={d.section_id ?? "selector"}>
      <SkruticSelector steps={d.steps} telegramLink={d.telegram_link} />
    </section>
  );
}
