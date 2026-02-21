import { ReadySolutions } from "@/components/sections/ReadySolutions";
import type { CmsBlock } from "./BlockRenderer";

interface Solution {
  slug: string;
  title: string;
  price: string;
  duration: string;
  description?: string;
}

interface ReadySolutionsData {
  title?: string;
  subtitle?: string;
  section_id?: string;
  variant?: "cards" | "faq";
  solutions?: Solution[];
}

export function BlockReadySolutions({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as ReadySolutionsData;
  return (
    <ReadySolutions
      title={d.title}
      subtitle={d.subtitle}
      sectionId={d.section_id}
      variant={d.variant}
      solutions={d.solutions}
    />
  );
}
