import { VideoCasesSlider } from "@/components/sections/VideoCasesSlider";
import type { CmsBlock } from "./BlockRenderer";

interface VideoCasesSliderData {
  title?: string;
  section_id?: string;
  use_featured_cases?: boolean;
}

export function BlockVideoCasesSlider({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as VideoCasesSliderData;
  return <VideoCasesSlider title={d.title} sectionId={d.section_id} />;
}
