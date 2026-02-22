import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import logosData from "@/data/logos.json";

export const ProofStrip = () => {
  return (
    <section className="py-12 md:py-16 border-y border-border/50">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-8">
            Работали с
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {logosData.map((client, index) => (
              <motion.a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-center group"
              >
                <div className="relative h-12 w-full flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-2xl font-heading font-bold text-foreground/50 group-hover:text-foreground transition-colors">
                    {client.name}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
