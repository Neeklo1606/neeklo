import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";

interface StorySection {
  title: string;
  content: string[];
}

interface CaseStoryProps {
  challenge: string[];
  approach: string[];
  solution: string[];
  outcome: string[];
}

export const CaseStory = ({ challenge, approach, solution, outcome }: CaseStoryProps) => {
  const sections: StorySection[] = [
    { title: "Задача", content: challenge },
    { title: "Подход", content: approach },
    { title: "Решение", content: solution },
    { title: "Результат", content: outcome },
  ];

  return (
    <section className="py-12 md:py-16 bg-card/30">
      <Container>
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-lg text-foreground/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
