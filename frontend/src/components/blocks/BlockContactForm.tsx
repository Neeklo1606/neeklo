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
    <section ref={ref} id={d.section_id ?? "contact"} className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            {d.title ?? "Свяжитесь с нами"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-xl">
            Расскажите о задаче — мы подготовим предложение
          </p>
        </div>
        <div className={`io-animate io-fade-up ${isVisible ? "io-visible" : ""}`}>
          <ContactFormModern title={d.title} hideTitle />
        </div>
      </Container>
    </section>
  );
}
