import { Container } from "@/components/common/Container";
import CasesGrid from "@/components/CasesGrid";
import type { CmsBlock } from "./BlockRenderer";

interface CasesGridData {
  title?: string;
  section_id?: string;
  limit?: number;
}

export function BlockCasesGrid({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as CasesGridData;

  return (
    <section id={d.section_id ?? undefined} className="py-10 min-[1024px]:py-20 overflow-x-clip">
      <Container>
        <CasesGrid title={d.title || "Портфолио"} limit={d.limit} />
      </Container>
    </section>
  );
}
