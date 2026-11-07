import { useState } from "react";
import { useMetaTags } from "@/hooks/useMetaTags";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, FileSearch, FileText, PenTool, Inbox, Database,
  TrendingUp, Calendar, Link2, Zap, BookOpen, Building,
  ChevronDown, ArrowRight, Calculator,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { TELEGRAM_PERSONAL } from "@/constants";
import { ProductWizard } from "@/components/product/ProductWizard";
import type { WizardPackage } from "@/components/product/wizardTypes";

const WIZARD_PACKAGES: WizardPackage[] = [
  {
    id: "basic",
    name: "Базовый",
    description: "Агент для одной задачи или канала",
    price: "от 85 000 ₽",
    features: ["10 дней", "Один канал", "Базовые интеграции"],
  },
  {
    id: "standard",
    name: "Стандарт",
    description: "Мультиканальный агент + CRM",
    price: "от 150 000 ₽",
    features: ["14 дней", "Telegram + сайт", "CRM-интеграция"],
  },
  {
    id: "premium",
    name: "Корпоративный",
    description: "Полная автоматизация бизнес-процессов",
    price: "от 350 000 ₽",
    features: ["30 дней", "Все каналы", "Корпоративные интеграции"],
  },
];

const NICHES = [
  { label: "Юристы", key: "legal" },
  { label: "Клиники", key: "clinic" },
  { label: "Недвижимость", key: "realty" },
  { label: "Строительство", key: "construction" },
  { label: "Отделы продаж", key: "sales" },
  { label: "Производство", key: "manufacturing" },
  { label: "Образование", key: "edu" },
  { label: "Сервисные компании", key: "service" },
] as const;

type NicheKey = typeof NICHES[number]["key"];

const NICHE_SUBTITLES: Record<NicheKey, string> = {
  legal: "Анализирует договоры, отвечает на типовые вопросы, составляет КП.",
  clinic: "Записывает пациентов, отвечает на вопросы о ценах и процедурах.",
  realty: "Подбирает объекты по параметрам, отвечает 24/7, передаёт горячих.",
  construction: "Рассчитывает сметы, отвечает на вопросы о материалах и сроках.",
  sales: "Квалифицирует лиды, создаёт КП, помогает менеджерам закрывать сделки.",
  manufacturing: "Принимает заявки, обрабатывает спецификации, отвечает на технические вопросы.",
  edu: "Консультирует по программам, помогает студентам, автоматизирует онбординг.",
  service: "Принимает заявки, назначает мастеров, отправляет уведомления клиентам.",
};

const CAPABILITIES = [
  { icon: MessageCircle, text: "Отвечает клиентам 24/7" },
  { icon: FileSearch, text: "Анализирует документы и договоры" },
  { icon: FileText, text: "Создаёт коммерческие предложения" },
  { icon: PenTool, text: "Работает с контентом" },
  { icon: Inbox, text: "Обрабатывает входящие заявки" },
  { icon: Database, text: "Собирает и структурирует данные" },
  { icon: TrendingUp, text: "Помогает отделу продаж" },
  { icon: Calendar, text: "Публикует материалы по расписанию" },
  { icon: Link2, text: "Интегрируется с CRM и Telegram" },
  { icon: Zap, text: "Автоматизирует рутинные процессы" },
  { icon: BookOpen, text: "Анализирует и суммаризирует тексты" },
  { icon: Building, text: "Работает в корпоративных системах" },
];

const EXAMPLES = [
  { title: "AI для юристов", desc: "Анализ договоров" },
  { title: "Telegram-парсер", desc: "Сбор данных из каналов" },
  { title: "Контент-агент", desc: "Автопостинг в соцсети" },
  { title: "AI помощник продаж", desc: "Квалификация лидов" },
  { title: "Корпоративная база знаний", desc: "Ответы сотрудникам" },
  { title: "AI для клиники", desc: "Запись и FAQ" },
];

const STATS = [
  { value: "70%", label: "рутинных задач автоматизируется" },
  { value: "10-14 дн", label: "от ТЗ до рабочего агента" },
  { value: "24/7", label: "работает без выходных и праздников" },
];

const FAQ_ITEMS = [
  {
    q: "На чём основан ИИ агент?",
    a: "На базе любой модели на выбор — DeepSeek, Gemini, GPT-4 и Claude. Обучаем на ваших данных — документах, FAQ, базе знаний.",
  },
  {
    q: "Может ли агент ошибаться?",
    a: "Да, поэтому настраиваем ограничения и эскалацию на живого менеджера при сложных случаях.",
  },
  {
    q: "Нужен ли нам программист для поддержки?",
    a: "Нет. Обновлять базу знаний можно через простой интерфейс или Notion.",
  },
  {
    q: "Как долго настройка?",
    a: "От 10-14 дней для базового агента. Сложные корпоративные системы — от 21 дня.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function AIAgentsPage() {
  const [activeNiche, setActiveNiche] = useState<NicheKey>("legal");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  useMetaTags(
    "ИИ агент для бизнеса - автоматизация и Telegram/MAX-боты | neeklo",
    "Разрабатываем ИИ ассистентов, автоматизацию процессов и Telegram-ботов для бизнеса. От 85 000 ₽. Старт от 7 дней."
  );

  return (
    <>

      <main className="min-h-screen bg-background pt-20 md:pt-24">
        {/* HERO */}
        <section className="px-4 py-12 md:py-20 max-w-5xl mx-auto">
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              AI · АВТОМАТИЗАЦИЯ
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              ИИ агент<br />для бизнеса
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              Отвечает клиентам, анализирует документы, собирает данные и передаёт готовые заявки менеджеру
            </p>
            <div className="inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">+ Telegram-боты, контент-агенты и корпоративные системы</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <span className="text-3xl font-bold text-foreground">от 85 000 ₽</span>
              <span className="text-muted-foreground text-sm">от 7 дней</span>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={TELEGRAM_PERSONAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
              >
                Обсудить проект <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-bold hover:bg-muted transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Рассчитать стоимость
              </button>
            </div>
          </div>
        </section>

        {/* NICHE SWITCHER */}
        <section className="px-4 pb-12 max-w-5xl mx-auto">
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 pb-1" style={{ width: "max-content" }}>
              {NICHES.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setActiveNiche(n.key)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeNiche === n.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeNiche}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-4 text-muted-foreground text-sm md:text-base"
            >
              {NICHE_SUBTITLES[activeNiche]}
            </motion.p>
          </AnimatePresence>
        </section>

        {/* CAPABILITIES */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Что умеет AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CAPABILITIES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground text-sm">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* EXAMPLES */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Что мы уже делали</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAMPLES.map((ex) => (
              <div key={ex.title} className="rounded-2xl border border-border p-5 hover:border-primary/50 transition-colors">
                <p className="font-semibold text-foreground">{ex.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{ex.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <div className="flex flex-row gap-6 md:gap-12">
            {STATS.map(({ value, label }) => (
              <div key={value} className="flex-1 min-w-0">
                <p className="text-3xl md:text-4xl font-bold text-primary">{value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CALCULATE CTA */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Рассчитать стоимость</h2>
          <p className="text-muted-foreground text-sm mb-6">Ответьте на 5 вопросов — подберём тариф и покажем цену</p>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Рассчитать стоимость
          </button>
        </section>

        {/* FAQ */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Частые вопросы</h2>
          <div>
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto rounded-2xl bg-foreground text-background px-8 py-12 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Готовы автоматизировать?</h2>
            <p className="text-background/70 text-sm">Отвечаем в течение 2 часов. Без оплаты на старте.</p>
            <a
              href={TELEGRAM_PERSONAL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Начать проект <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />

      <ProductWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        productSlug="ai-agent"
        productTitle="ИИ агент для бизнеса"
        packages={WIZARD_PACKAGES}
        telegramLink={TELEGRAM_PERSONAL}
      />
    </>
  );
}
