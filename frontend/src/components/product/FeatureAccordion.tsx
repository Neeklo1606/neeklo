import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface FeatureAccordionProps {
  title: string;
  features: Feature[];
}

export const FeatureAccordion = ({ title, features }: FeatureAccordionProps) => {
  return (
    <section className="py-12 md:py-16 relative bg-surface/30">
      <Container>
        <motion.h2
          className="text-3xl md:text-4xl font-heading font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-surface border border-border rounded-xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      {Icon && <Icon className="w-6 h-6 text-primary flex-shrink-0" />}
                      <span className="text-lg font-semibold">{feature.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-foreground-muted leading-relaxed">
                    {feature.description}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
};
