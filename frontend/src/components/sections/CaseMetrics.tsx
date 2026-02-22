import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";

interface Metric {
  value: string;
  label: string;
}

interface CaseMetricsProps {
  metrics: Metric[];
}

export const CaseMetrics = ({ metrics }: CaseMetricsProps) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-card/30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Результаты в цифрах
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                {metric.value}
              </div>
              <p className="text-lg text-muted-foreground">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
