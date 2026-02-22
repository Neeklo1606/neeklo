import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Smartphone, Sparkles, Zap } from "lucide-react";

const principles = [
  {
    icon: Sparkles,
    title: "Глубокий минимализм",
    description: "Убираем всё лишнее, оставляя только суть",
  },
  {
    icon: Zap,
    title: "Motion первым делом",
    description: "Анимация как часть пользовательского опыта",
  },
  {
    icon: Smartphone,
    title: "Мобильная адаптация",
    description: "Mobile-first подход к каждому проекту",
  },
];

export const Approach = () => {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionTitle
          title="Наш подход"
          subtitle="Философия работы, которая приносит результат"
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p className="text-lg">
              Мы верим, что настоящий дизайн — это не украшательство, а решение задач. 
              Каждый пиксель, каждая анимация должны работать на пользователя и бизнес. 
              Минимализм для нас — не тренд, а способ мышления.
            </p>
            
            <p className="text-lg">
              Технологии постоянно меняются, но принципы остаются. Мы используем 
              передовые инструменты и фреймворки, но всегда помним о производительности, 
              доступности и масштабируемости. Код должен быть чистым, как дизайн.
            </p>
            
            <p className="text-lg">
              В конечном счёте всё сводится к результату. Красивый дизайн, который не 
              конвертирует — это не дизайн. Быстрый сайт без душі — это не продукт. 
              Мы создаём решения, которые работают на бизнес-цели и радуют пользователей.
            </p>
          </div>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                <principle.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">
                {principle.title}
              </h3>
              
              <p className="text-muted-foreground">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
