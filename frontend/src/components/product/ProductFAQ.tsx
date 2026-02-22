import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  title?: string;
  items: FAQItem[];
}

export const ProductFAQ = ({
  title = "Частые вопросы",
  items,
}: ProductFAQProps) => {
  return (
    <section className="py-12 md:py-16 bg-surface/30">
      <Container>
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border rounded-lg sm:rounded-xl px-3 sm:px-5 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-medium text-sm sm:text-base py-3 sm:py-4 hover:no-underline gap-2">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs sm:text-sm pb-3 sm:pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
};
