import type { ReactNode } from "react";
import { BlockHero } from "./BlockHero";
import { BlockVideoCasesSlider } from "./BlockVideoCasesSlider";
import { BlockNewsSection } from "./BlockNewsSection";
import { BlockContactForm } from "./BlockContactForm";
import { BlockServicesGrid } from "./BlockServicesGrid";
import { BlockCasesGrid } from "./BlockCasesGrid";
import { BlockCasesHoverSection } from "./BlockCasesHoverSection";
import { BlockPostsGrid } from "./BlockPostsGrid";
import { BlockProcessSteps } from "./BlockProcessSteps";
import { BlockServicesTeaser } from "./BlockServicesTeaser";
import { BlockFAQ } from "./BlockFAQ";

export interface CmsBlock {
  id: number;
  type: string;
  position: number;
  is_enabled: boolean;
  data: Record<string, unknown>;
}

/** Блок "Готовые решения" удалён — всегда показываем "Частые вопросы" (в т.ч. для старых записей в БД с type ready_solutions). */
function normalizeBlock(block: CmsBlock): CmsBlock {
  if (block.type !== "ready_solutions") return block;
  const d = (block.data || {}) as {
    title?: string;
    subtitle?: string;
    solutions?: Array<{ title?: string; price?: string; duration?: string; description?: string }>;
  };
  const solutions = Array.isArray(d.solutions) ? d.solutions : [];
  const items = solutions.map((s) => ({
    question: s.title ?? "",
    answer: s.description ?? "Обсудим задачу и сроки — ответим в тот же день. Напишите в Telegram или оставьте заявку ниже.",
    meta: [s.price, s.duration].filter(Boolean).join(", "),
  }));
  return {
    ...block,
    type: "faq",
    data: {
      title: d.title ?? "Частые вопросы",
      subtitle: d.subtitle ?? "Цена и сроки по каждому решению. Ответим в тот же день.",
      items,
    },
  };
}

const BLOCK_MAP: Record<string, (props: { block: CmsBlock }) => ReactNode> = {
  hero: (props) => <BlockHero {...props} />,
  services_teaser: (props) => <BlockServicesTeaser {...props} />,
  video_cases_slider: (props) => <BlockCasesHoverSection {...props} />,
  news_section: (props) => <BlockNewsSection {...props} />,
  contact_form: (props) => <BlockContactForm {...props} />,
  services_grid: (props) => <BlockServicesGrid {...props} />,
  cases_grid: (props) => <BlockCasesGrid {...props} />,
  cases_hover: (props) => <BlockCasesHoverSection {...props} />,
  posts_grid: (props) => <BlockPostsGrid {...props} />,
  process_steps: (props) => <BlockProcessSteps {...props} />,
  faq: (props) => <BlockFAQ {...props} />,
};

export function BlockRenderer({ blocks }: { blocks?: CmsBlock[] | null }) {
  const list = Array.isArray(blocks) ? blocks : [];
  const sorted = [...list].sort((a, b) => a.position - b.position);

  return (
    <>
      {sorted.map((block) => {
        if (!block.is_enabled) return null;
        const normalized = normalizeBlock(block);
        const Component = BLOCK_MAP[normalized.type];
        if (!Component) return null;
        return <Component key={block.id} block={normalized} />;
      })}
    </>
  );
}
