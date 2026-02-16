import { ContactFormModern } from "@/components/common/ContactFormModern";
import { Container } from "@/components/common/Container";
import type { CmsBlock } from "./BlockRenderer";

interface ContactFormData {
  section_id?: string;
  title?: string;
}

export function BlockContactForm({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as ContactFormData;
  return (
    <section id={d.section_id ?? "contact"} className="py-16 md:py-24">
      <Container>
        <ContactFormModern title={d.title} />
      </Container>
    </section>
  );
}
