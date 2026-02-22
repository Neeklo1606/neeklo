import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/common/Card";

interface CaseSummaryProps {
  client: string;
  role: string;
  duration: string;
  stack: string[];
  results: string[];
}

export const CaseSummary = ({ client, role, duration, stack, results }: CaseSummaryProps) => {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" hover={false}>
            {/* Client */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Клиент
              </h3>
              <p className="text-lg font-semibold text-foreground">{client}</p>
            </div>

            {/* Role */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Наша роль
              </h3>
              <p className="text-lg font-semibold text-foreground">{role}</p>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Сроки
              </h3>
              <p className="text-lg font-semibold text-foreground">{duration}</p>
            </div>

            {/* Stack */}
            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Технологии
              </h3>
              <div className="flex flex-wrap gap-2">
                {stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-2">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Результаты
              </h3>
              <ul className="space-y-2">
                {results.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span className="text-foreground">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
};
