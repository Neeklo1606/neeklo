import { useState } from "react";
import { useMetaTags } from "@/hooks/useMetaTags";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, Smartphone, Inbox, Settings, Bot, Globe, Server,
  MapPin, Search, FileText, BarChart, GraduationCap,
  ChevronDown, ArrowRight, Calculator,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { TELEGRAM_PERSONAL } from "@/constants";
import { ProductWizard } from "@/components/product/ProductWizard";
import type { WizardPackage } from "@/components/product/wizardTypes";

const WIZARD_PACKAGES: WizardPackage[] = [
  {
    id: "basic",
    name: "Базовый",
    description: "Лендинг + ИИ-ассистент + CRM",
    price: "от 65 000 ₽",
    features: ["14 дней", "Адаптивный дизайн", "ИИ + CRM"],
  },
  {
    id: "standard",
    name: "Стандарт",
    description: "Полный сайт + панель управления",
    price: "от 120 000 ₽",
    features: ["21 день", "CMS-панель", "Все интеграции"],
  },
  {
    id: "premium",
    name: "Премиум",
    description: "Кастомная платформа под ключ",
    price: "от 250 000 ₽",
    features: ["45 дней", "Уникальный дизайн", "Любые интеграции"],
  },
];

const NICHES = [
  { label: "Клиника / стоматология", key: "clinic" },
  { label: "Салон красоты", key: "salon" },
  { label: "Недвижимость", key: "realty" },
  { label: "Строительство", key: "construction" },
  { label: "Интернет-магазин", key: "shop" },
  { label: "Производство", key: "manufacturing" },
  { label: "Онлайн-школа", key: "edu" },
  { label: "Эксперты и блогеры", key: "experts" },
  { label: "Юридические компании", key: "legal" },
  { label: "Любой бизнес", key: "any" },
] as const;

type NicheKey = typeof NICHES[number]["key"];

const NICHE_SUBTITLES: Record<NicheKey, string> = {
  clinic: "Запись пациентов онлайн. AI отвечает на вопросы о процедурах и ценах.",
  salon: "Клиент сам выбирает мастера и время. Без звонков и ожидания.",
  realty: "Каталог объектов, заявки, AI-консультант по выбору.",
  construction: "Портфолио работ, расчёт стоимости, заявки 24/7.",
  shop: "Каталог, корзина, оплата, AI-помощник по выбору товара.",
  manufacturing: "Каталог продукции, оптовые заявки, личный кабинет клиента.",
  edu: "Продажа курсов, личный кабинет ученика, AI-поддержка студентов.",
  experts: "Личный бренд, продажа услуг, запись на консультации.",
  legal: "Портфолио дел, AI-консультант по типовым вопросам, запись.",
  any: "Создаём сайт, который принимает заявки и отвечает клиентам 24/7.",
};

const INCLUDES = [
  { icon: Palette, text: "Дизайн и разработка" },
  { icon: Smartphone, text: "Адаптация под мобильные" },
  { icon: Inbox, text: "CRM для заявок" },
  { icon: Settings, text: "Административная панель" },
  { icon: Bot, text: "AI-ассистент" },
  { icon: Globe, text: "Подключение домена и хостинга" },
  { icon: Server, text: "Размещение на сервере" },
  { icon: MapPin, text: "Регистрация в Яндекс Бизнес" },
  { icon: Search, text: "Базовая SEO-настройка" },
  { icon: FileText, text: "Помощь с наполнением контентом" },
  { icon: BarChart, text: "Аналитика и формы заявок" },
  { icon: GraduationCap, text: "Обучение работе с системой" },
];

const BEFORE_AFTER = [
  { before: "Менеджер не успевает отвечать ночью", after: "AI отвечает за 30 секунд в любое время" },
  { before: "Заявки теряются в мессенджерах", after: "CRM фиксирует каждое обращение" },
  { before: "Клиент не может записаться сам", after: "Онлайн-запись без звонков" },
];

const STATS = [
  { value: "69%", label: "вопросов AI закрывает без менеджера" },
  { value: "14 дн", label: "от брифа до запуска" },
  { value: "24/7", label: "приём заявок без выходных" },
];

const FAQ_ITEMS = [
  {
    q: "Нужен ли AI-ассистент если у меня маленький сайт?",
    a: "Если вы получаете хотя бы одну заявку в день — нужен. Он работает пока вы спите.",
  },
  {
    q: "Сколько займёт разработка?",
    a: "Базовый проект — 14 дней с момента согласования. Сложные платформы — от 30 дней.",
  },
  {
    q: "Что если мне потом понадобится что-то добавить?",
    a: "Архитектура строится с расчётом на рост. Добавить функции можно в любой момент.",
  },
  {
    q: "Нужно ли мне разбираться в технических деталях?",
    a: "Нет. Вы получаете готовую систему с обучением и документацией.",
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
        <ChevronDown
          className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")}
        />
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


export default function WebsitesPage() {
  const [activeNiche, setActiveNiche] = useState<NicheKey>("any");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  useMetaTags(
    "Разработка сайтов под ключ | Сайты, CRM и платформы - neeklo",
    "Создаём сайты, интернет-магазины и платформы с CRM, ИИ ассистентом и Админ панелью. От лендингов до сложных веб-систем. От 65 000 ₽"
  );

  return (
    <>

      <main className="min-h-screen bg-background pt-20 md:pt-24">
        {/* HERO */}
        <section className="px-4 py-12 md:py-20 max-w-5xl mx-auto">
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              РАЗРАБОТКА · ПОД КЛЮЧ
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Сайт под ключ<br />для бизнеса
            </h1>
            <p className="text-base text-muted-foreground">
              С ИИ ассистентом, CRM и заявками в одной системе
            </p>
            <div className="inline-flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">+ Админ панель для управления контентом</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div>
                <span className="text-3xl font-bold text-foreground">от 65 000 ₽</span>
              </div>
              <div className="text-muted-foreground text-sm">от 14 дней</div>
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

        {/* WHAT'S INCLUDED */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Что входит в стоимость</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INCLUDES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground text-sm">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Что изменится</h2>
          <div className="space-y-4">
            {BEFORE_AFTER.map(({ before, after }, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
                <div className="flex-1 px-4 py-3 rounded-xl bg-muted/50 text-muted-foreground text-sm">
                  {before}
                </div>
                <span className="text-primary font-bold self-center hidden md:block">→</span>
                <span className="text-primary font-bold self-center md:hidden">↓</span>
                <div className="flex-1 px-4 py-3 rounded-xl bg-primary/10 text-foreground text-sm font-medium">
                  {after}
                </div>
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

        {/* CASES */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Примеры наших работ</h2>
            <Link to="/cases" className="text-sm text-primary hover:underline flex items-center gap-1">
              Все работы <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Сайт для клиники", gradient: "from-blue-500/20 to-purple-500/20" },
              { title: "Интернет-магазин", gradient: "from-green-500/20 to-emerald-500/20" },
              { title: "Корпоративный портал", gradient: "from-orange-500/20 to-red-500/20" },
            ].map((c) => (
              <Link key={c.title} to="/cases" className="block rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-colors">
                <div className={cn("h-40 bg-gradient-to-br", c.gradient, "flex items-end p-4")}>
                  <span className="font-semibold text-foreground text-sm">{c.title}</span>
                </div>
              </Link>
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

        {/* PROCESS */}
        <section className="px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Как работаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Обсуждаем", desc: "Созвон или переписка, фиксируем стоимость до старта" },
              { num: "02", title: "Делаем", desc: "Показываем прогресс каждые 2-3 дня" },
              { num: "03", title: "Запускаем", desc: "Сдаём, обучаем, остаёмся на связи" },
            ].map(({ num, title, desc }) => (
              <div key={num} className="space-y-2">
                <span className="text-4xl font-bold text-primary/30">{num}</span>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
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
            <h2 className="text-2xl md:text-3xl font-bold">Готовы начать?</h2>
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
        productSlug="website"
        productTitle="Сайт под ключ для бизнеса"
        packages={WIZARD_PACKAGES}
        telegramLink={TELEGRAM_PERSONAL}
      />
    </>
  );
}
