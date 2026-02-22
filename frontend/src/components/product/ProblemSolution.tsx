import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ProblemSolutionProps {
  problems: string[];
  solution: string;
}

export const ProblemSolution = ({ problems, solution }: ProblemSolutionProps) => {
  return (
    <section className="py-12 md:py-16 relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-warning" />
              Какую проблему решаем
            </h2>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-surface/50 border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0" />
                  <p className="text-foreground-muted">{problem}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-success" />
              Как neeklo_studio помогает
            </h2>
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <p className="text-lg text-foreground leading-relaxed">{solution}</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
