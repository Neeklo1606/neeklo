import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

const packages: Package[] = [
  {
    name: "Старт",
    price: "от 50 000 ₽",
    description: "Для быстрого запуска проекта",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Лендинг или сайт-визитка",
      "Базовая SEO-оптимизация",
      "Адаптив под мобильные",
      "Срок: 5-7 дней",
      "1 месяц поддержки",
    ],
  },
  {
    name: "Бизнес",
    price: "от 150 000 ₽",
    description: "Комплексное digital-решение",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-primary to-accent",
    highlighted: true,
    features: [
      "Многостраничный сайт",
      "Telegram-бот или AI-ассистент",
      "Интеграция с CRM",
      "Аналитика и метрики",
      "Срок: 2-4 недели",
      "3 месяца поддержки",
    ],
  },
  {
    name: "Экосистема",
    price: "от 500 000 ₽",
    description: "Полная digital-трансформация",
    icon: <Crown className="w-6 h-6" />,
    gradient: "from-amber-500 to-orange-500",
    features: [
      "Веб-платформа + мобильное приложение",
      "AI-автоматизация процессов",
      "Кастомные интеграции",
      "Обучение команды",
      "Срок: 1-3 месяца",
      "12 месяцев поддержки",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background" />
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Тарифы
          </h2>
          <p className="text-foreground-muted max-w-2xl mx-auto">
            Выберите подходящий формат сотрудничества. Все цены — стартовые, 
            финальная стоимость зависит от задачи.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              className={`relative p-6 md:p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                pkg.highlighted
                  ? "bg-gradient-to-br from-primary/10 via-surface/80 to-accent/10 border-primary/50 shadow-lg shadow-primary/10 dark:shadow-primary/20 scale-[1.02]"
                  : "bg-surface/50 dark:bg-surface/30 border-border hover:border-primary/30"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-medium text-white">
                  Популярный
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${pkg.gradient} text-white`}>
                  {pkg.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-sm text-foreground-muted">{pkg.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className={`text-3xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                  {pkg.price}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex gap-3 text-sm">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      pkg.highlighted ? "text-primary" : "text-success"
                    }`} />
                    <span className="text-foreground-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={`/contact?product=${encodeURIComponent(pkg.name)}`}>
                <Button
                  variant={pkg.highlighted ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                >
                  Обсудить проект
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-sm text-foreground-muted mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Нужен индивидуальный расчёт?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Свяжитесь с нами
          </Link>
        </motion.p>
      </Container>
    </section>
  );
};
