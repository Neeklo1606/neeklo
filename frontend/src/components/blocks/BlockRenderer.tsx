import type { ReactNode } from "react";
import { BlockHero } from "./BlockHero";
import { BlockVideoCasesSlider } from "./BlockVideoCasesSlider";
import { BlockSkruticSelector } from "./BlockSkruticSelector";
import { BlockReadySolutions } from "./BlockReadySolutions";
import { BlockNewsSection } from "./BlockNewsSection";
import { BlockContactForm } from "./BlockContactForm";
import { BlockServicesGrid } from "./BlockServicesGrid";
import { BlockCasesGrid } from "./BlockCasesGrid";
import { BlockPostsGrid } from "./BlockPostsGrid";

export interface CmsBlock {
  id: number;
  type: string;
  position: number;
  is_enabled: boolean;
  data: Record<string, unknown>;
}

const BLOCK_MAP: Record<string, (props: { block: CmsBlock }) => ReactNode> = {
  hero: (props) => <BlockHero {...props} />,
  video_cases_slider: (props) => <BlockVideoCasesSlider {...props} />,
  skrutic_selector: (props) => <BlockSkruticSelector {...props} />,
  ready_solutions: (props) => <BlockReadySolutions {...props} />,
  news_section: (props) => <BlockNewsSection {...props} />,
  contact_form: (props) => <BlockContactForm {...props} />,
  services_grid: (props) => <BlockServicesGrid {...props} />,
  cases_grid: (props) => <BlockCasesGrid {...props} />,
  posts_grid: (props) => <BlockPostsGrid {...props} />,
};

export function BlockRenderer({ blocks }: { blocks: CmsBlock[] }) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <>
      {sorted.map((block) => {
        if (!block.is_enabled) return null;
        const Component = BLOCK_MAP[block.type];
        if (!Component) return null;
        return <Component key={block.id} block={block} />;
      })}
    </>
  );
}
