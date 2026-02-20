import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { ArrowRight } from "lucide-react";

interface CaseExample {
  title: string;
  industry: string;
  challenge: string;
  result: string;
  image?: string;
}

interface CaseExamplesProps {
  title: string;
  cases: CaseExample[];
}

export const CaseExamples = ({ title, cases }: CaseExamplesProps) => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <Container>
        <motion.h2
          className="text-3xl md:text-4xl font-heading font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <div className="relative">
          {/* Horizontal scroll container on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 snap-x snap-mandatory">
            {cases.map((caseItem, index) => (
              <motion.div
                key={index}
                className="min-w-[85vw] md:min-w-0 snap-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full p-6 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all duration-300 group">
                  {/* Image */}
                  {caseItem.image && (
                    <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={caseItem.image}
                        alt={caseItem.title}
                        width={800}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>
                      <p className="text-sm text-accent">{caseItem.industry}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground-subtle mb-1">Задача:</p>
                      <p className="text-sm text-foreground-muted">{caseItem.challenge}</p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium text-success mb-1 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Результат:
                      </p>
                      <p className="text-sm text-foreground">{caseItem.result}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator for mobile */}
          <div className="md:hidden flex justify-center gap-2 mt-6">
            {cases.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-border"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
