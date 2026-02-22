import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { TrendingUp } from "lucide-react";

interface CaseStudy {
  title: string;
  result: string;
  metrics?: string[];
}

interface CompactCasesProps {
  title?: string;
  cases: CaseStudy[];
}

export const CompactCases = ({
  title = "Результаты клиентов",
  cases,
}: CompactCasesProps) => {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {cases.map((caseStudy, index) => (
            <motion.div
              key={index}
              className="bg-surface border border-border rounded-xl p-4 md:p-5 transition-all hover:border-primary/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">{caseStudy.title}</h3>
                  <p className="text-xs md:text-sm text-foreground-muted mb-2 line-clamp-2">{caseStudy.result}</p>
                  
                  {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {caseStudy.metrics.map((metric, mIndex) => (
                        <span
                          key={mIndex}
                          className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};