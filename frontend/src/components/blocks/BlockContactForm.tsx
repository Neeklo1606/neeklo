import { ContactFormModern } from "@/components/common/ContactFormModern";
import { Container } from "@/components/common/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { CmsBlock } from "./BlockRenderer";

interface ContactFormData {
  section_id?: string;
  title?: string;
}

export function BlockContactForm({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as ContactFormData;
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id={d.section_id ?? "contact"} className="py-16 md:py-24">
      <Container>
        <div className={`io-animate io-fade-up ${isVisible ? "io-visible" : ""}`}>
          <ContactFormModern title={d.title} />
        </div>
      </Container>
    </section>
  );
}
