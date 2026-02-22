import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import type { CmsBlock } from "./BlockRenderer";

interface StepItem {
  num?: string;
  icon?: string;
  title?: string;
  desc?: string;
}

interface ProcessStepsData {
  title?: string;
  steps?: StepItem[];
}

const DEFAULT_STEPS: StepItem[] = [
  {
    num: "01",
    icon: "🛍️",
    title: "Выбираете услугу",
    desc: "Как в магазине — листаете, выбираете, добавляете в корзину",
  },
  {
    num: "02",
    icon: "📋",
    title: "Заполняете бриф",
    desc: "Короткая форма после оформления — 5 минут и готово",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Мы делаем",
    desc: "Берём в работу, статус всегда в личном кабинете",
  },
  {
    num: "04",
    icon: "🚀",
    title: "Получаете результат",
    desc: "Принимаете работу, скачиваете файлы или получаете доступы",
  },
];

export function BlockProcessSteps({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as ProcessStepsData;
  const steps = (d.steps?.length ? d.steps : DEFAULT_STEPS) as StepItem[];
  const title = d.title ?? "Как это работает";

  return (
    <section id="process" className="py-12 md:py-16 bg-white text-[#0a0a0a]">
      <Container className="max-w-[1200px]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-12">
          {title.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-[#e8e8e5] rounded-[20px] overflow-hidden bg-[#e8e8e5]">
          {steps.map((step, index) => (
            <motion.div
              key={step.num ?? index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="bg-white p-6 md:p-8 hover:bg-[#f5f5f3] transition-colors"
            >
              <div className="text-[11px] text-[#6b6b6b] uppercase tracking-widest mb-4">
                {step.num ?? String(index + 1).padStart(2, "0")}
              </div>
              <div className="text-2xl mb-3">{step.icon ?? "•"}</div>
              <h3 className="font-semibold text-[15px] mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed font-light">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
