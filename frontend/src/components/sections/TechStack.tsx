import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";

const tools = [
  { name: "Figma", category: "Design" },
  { name: "Framer", category: "Design" },
  { name: "After Effects", category: "Motion" },
  { name: "Spline", category: "3D" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Laravel", category: "Backend" },
  { name: "GSAP", category: "Animation" },
  { name: "Framer Motion", category: "Animation" },
];

export const TechStack = () => {
  return (
    <section className="py-12 md:py-16 bg-card/30">
      <Container>
        <SectionTitle
          title="Инструменты и технологии"
          subtitle="Работаем с передовым стеком для создания лучших решений"
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="glass-card rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300">
                <div className="text-2xl font-heading font-bold text-foreground/90 group-hover:text-primary transition-colors mb-2">
                  {tool.name}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {tool.category}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
