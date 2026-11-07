import { useState } from "react";
import { useMetaTags } from "@/hooks/useMetaTags";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Smartphone, Sparkles, Film, Star, Building,
  Monitor, Tv, Gift, ShoppingBag, Mic, Scissors,
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
    name: "Один ролик",
    description: "Один ролик до 60 секунд",
    price: "от 15 000 ₽",
    features: ["1-3 дня", "3 правки", "Монтаж + озвучка"],
  },
  {
    id: "standard",
    name: "Пакет",
    description: "3-5 роликов разных форматов",
    price: "от 45 000 ₽",
    features: ["5-7 дней", "3 правки каждый", "Разные форматы"],
  },
  {
    id: "premium",
    name: "Абонемент",
    description: "Регулярный контент каждый месяц",
    price: "от 90 000 ₽/мес",
    features: ["Ежемесячно", "8+ роликов", "SMM-стратегия"],
  },
];

const NICHES = [
  { label: "Недвижимость", key: "realty" },
  { label: "Клиники", key: "clinic" },
  { label: "Рестораны", key: "restaurant" },
  { label: "Производство", key: "manufacturing" },
  { label: "Онлайн-школы", key: "edu" },
  { label: "Бренды", key: "brand" },
  { label: "Эксперты", key: "experts" },
  { label: "B2B", key: "b2b" },
] as const;

type NicheKey = typeof NICHES[number]["key"];

const NICHE_SUBTITLES: Record<NicheKey, string> = {
  realty: "Обзоры объектов, рекламные ролики для Авито и соцсетей.",
  clinic: "Ролики о процедурах, врачах и результатах для доверия пациентов.",
  restaurant: "Аппетитные Reels и рекламные ролики для привлечения гостей.",
  manufacturing: "Презентация продукции, корпоративные ролики, обзоры для B2B.",
  edu: "Промо курсов, анимированные объяснения, контент для соцсетей.",
  brand: "Имиджевые ролики, рекламные кампании, визуальный стиль бренда.",
  experts: "Личный бренд, экспертный контент, Reels для роста аудитории.",
  b2b: "Презентации продуктов, обучающие ролики, корпоративный видеоконтент.",
};

const SERVICES = [
  { icon: Play, text: "Рекламные ролики для соцсетей" },
  { icon: Smartphone, text: "Reels и TikTok" },
  { icon: Sparkles, text: "AI-генерация видео" },
  { icon: Film, text: "Анимация и моушн-дизайн" },
  { icon: Star, text: "Мультфильмы и мультсериалы" },
  { icon: Building, text: "Корпоративные ролики" },
  { icon: Monitor, text: "Презентации продуктов" },
  { icon: Tv, text: "Ролики для рекламы и ТВ" },
  { icon: Gift, text: "Поздравительные видео" },
  { icon: ShoppingBag, text: "Контент для Авито и маркетплейсов" },
  { icon: Mic, text: "Озвучка и субтитры" },
  { icon: Scissors, text: "Полный монтаж под ключ" },
];

const PROCESS_STEPS = ["Сценарий", "Генерация", "Монтаж", "Озвучка", "Публикация"];

const STATS = [
  { value: "100+", label: "проектов в портфолио" },
  { value: "1 день", label: "минимальный срок ролика" },
  { value: "3-5 дн", label: "стандартный Reels под ключ" },
];

const FAQ_ITEMS = [
  {
    q: "Нужно ли мне что-то записывать самому?",
    a: "Нет. Используем AI-генерацию, стоковые материалы и ваши фото/видео если есть.",
  },
  {
    q: "Можно ли с реальным лицом или голосом?",
    a: "Да — через HeyGen создадим AI-аватара или используем запись вашего голоса.",
  },
  {
    q: "Сколько правок включено?",
    a: "До 3 итераций на каждый ролик.",
  },
  {
    q: "Подойдёт ли для таргетированной рекламы?",
    a: "Да, делаем под технические требования VK, Telegram, YouTube, Авито.",
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


export default function VideoPage() {
  const [activeNiche, setActiveNiche] = useState<NicheKey>("realty");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  useMetaTags(
    "ИИ видео и контент для бизнеса - рекламные ролики, Reels, ИИ видео | neeklo",
    "Создаём рекламные ролики, Reels, ИИ видео и анимацию для бизнеса. Полный цикл: сценарий → генерация → монтаж → озвучка. От 15 000 ₽."
  );

  return (
    <>

      <main className="min-h-screen bg-background pt-20 md:pt-24">
        {/* HERO */}
        <section className="px-4 py-12 md:py-20 max-w-5xl mx-auto">
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              ПРОДАКШН · AI-ВИДЕО
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              ИИ видео и контент<br />для бизнеса
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              Рекламные ролики, Reels, ИИ видео и анимация для сайта, соцсетей и рекламы
            </p>
            <div className="inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">+ Мультсериалы, поздравления, корпоративные ролики под ключ</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <span className="text-3xl font-bold text-foreground">от 15 000 ₽</span>
              <span className="text-muted-foreground text-sm">от 1 дня</span>
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

        {/* SERVICES */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Что делаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SERVICES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground text-sm">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Как это работает</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold text-foreground">{step}</span>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <span className="text-muted-foreground hidden md:block">→</span>
                )}
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

        {/* EXAMPLES */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Примеры работ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "AI-анимация", gradient: "from-violet-500/20 to-pink-500/20" },
              { title: "Рекламный ролик", gradient: "from-blue-500/20 to-cyan-500/20" },
              { title: "Corporate", gradient: "from-amber-500/20 to-orange-500/20" },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl overflow-hidden border border-border">
                <div className={cn("h-40 bg-gradient-to-br", c.gradient, "flex items-center justify-center")}>
                  <Play className="w-10 h-10 text-foreground/40" />
                </div>
                <div className="p-3">
                  <span className="text-sm font-medium text-foreground">{c.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALCULATE CTA */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Рассчитать стоимость</h2>
          <p className="text-muted-foreground text-sm mb-6">Ответьте на 5 вопросов — подберём формат и покажем цену</p>
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
            <h2 className="text-2xl md:text-3xl font-bold">Готовы снять?</h2>
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
        productSlug="ai-video"
        productTitle="ИИ видео и контент для бизнеса"
        packages={WIZARD_PACKAGES}
        telegramLink={TELEGRAM_PERSONAL}
      />
    </>
  );
}
