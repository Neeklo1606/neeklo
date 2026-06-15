import type { WizardOption, WizardStep, WizardPackage, WizardAnswers } from "./wizardTypes";

export function extractPrice(priceStr: string): number {
  const match = priceStr.match(/[\d\s]+/);
  return match ? parseInt(match[0].replace(/\s/g, ""), 10) : 0;
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getProductFeatures(slug: string): WizardOption[] {
  const featureMap: Record<string, WizardOption[]> = {
    "ai-agent": [
      { id: "voice",     emoji: "🎙️", label: "Голосовой бот",    priceModifier: 25, timeModifier: 7 },
      { id: "crm",       emoji: "📊", label: "Интеграция CRM",   priceModifier: 15, timeModifier: 3 },
      { id: "analytics", emoji: "📈", label: "Аналитика",        priceModifier: 10, timeModifier: 2 },
      { id: "multilang", emoji: "🌐", label: "Мультиязычность",  priceModifier: 20, timeModifier: 5 },
    ],
    "telegram-bot": [
      { id: "payments",  emoji: "💳", label: "Приём оплаты",     priceModifier: 20, timeModifier: 3 },
      { id: "catalog",   emoji: "🛍️", label: "Каталог товаров",  priceModifier: 15, timeModifier: 4 },
      { id: "crm",       emoji: "📊", label: "Интеграция CRM",   priceModifier: 15, timeModifier: 3 },
      { id: "broadcast", emoji: "📢", label: "Рассылки",         priceModifier: 10, timeModifier: 2 },
    ],
    "website": [
      { id: "cms",       emoji: "✏️", label: "CMS-панель",       priceModifier: 20, timeModifier: 5 },
      { id: "seo",       emoji: "🔍", label: "SEO-пакет",        priceModifier: 15, timeModifier: 3 },
      { id: "multilang", emoji: "🌐", label: "Мультиязычность",  priceModifier: 25, timeModifier: 7 },
      { id: "animation", emoji: "✨", label: "Анимации",         priceModifier: 10, timeModifier: 3 },
    ],
    "ai-video": [
      { id: "avatar",    emoji: "🧑‍💼", label: "AI-аватар",       priceModifier: 30, timeModifier: 5 },
      { id: "voice",     emoji: "🎤", label: "Озвучка",          priceModifier: 15, timeModifier: 2 },
      { id: "subtitles", emoji: "💬", label: "Субтитры",         priceModifier: 10, timeModifier: 1 },
      { id: "music",     emoji: "🎵", label: "Музыка",           priceModifier:  5, timeModifier: 1 },
    ],
    "default": [
      { id: "support",   emoji: "🛡️", label: "Поддержка",        priceModifier: 15, timeModifier:  0 },
      { id: "priority",  emoji: "⚡", label: "Приоритет",        priceModifier: 20, timeModifier: -5 },
      { id: "training",  emoji: "📚", label: "Обучение",         priceModifier: 10, timeModifier:  2 },
      { id: "docs",      emoji: "📝", label: "Документация",     priceModifier:  5, timeModifier:  1 },
    ],
  };
  return featureMap[slug] ?? featureMap["default"];
}

export function generateSteps(productSlug: string): WizardStep[] {
  return [
    {
      id: "need",
      title: "Что нужно?",
      subtitle: "Выберите тип задачи",
      type: "single",
      required: true,
      options: [
        { id: "new",     emoji: "🚀", label: "Новый проект",  description: "Создать с нуля" },
        { id: "improve", emoji: "✨", label: "Улучшить",       description: "Доработать существующее" },
        { id: "fix",     emoji: "🔧", label: "Исправить",      description: "Починить или переделать" },
        { id: "consult", emoji: "💡", label: "Консультация",   description: "Обсудить идею" },
      ],
    },
    {
      id: "details",
      title: "Детали проекта",
      subtitle: "Расскажите о задаче",
      type: "textarea",
      placeholder: "Опишите что нужно сделать, какие функции важны, есть ли референсы...",
      required: true,
    },
    {
      id: "features",
      title: "Дополнительные опции",
      subtitle: "Выберите нужное (необязательно)",
      type: "multi",
      required: false,
      options: getProductFeatures(productSlug),
    },
    {
      id: "budget",
      title: "Бюджет и сроки",
      subtitle: "Ваши ожидания",
      type: "single",
      required: true,
      options: [
        { id: "minimal",  emoji: "💰", label: "Минимальный", description: "Базовый функционал",    priceModifier: -20, timeModifier: -5 },
        { id: "standard", emoji: "💎", label: "Стандартный", description: "Оптимальное решение",   priceModifier:   0, timeModifier:  0 },
        { id: "premium",  emoji: "👑", label: "Премиум",     description: "Максимум возможностей", priceModifier:  40, timeModifier: 10 },
        { id: "flexible", emoji: "🤝", label: "Обсудим",     description: "Гибкий подход",         priceModifier:   0, timeModifier:  0 },
      ],
    },
    {
      id: "contact",
      title: "Как связаться?",
      subtitle: "Telegram, WhatsApp или телефон",
      type: "text",
      placeholder: "@username или +7...",
      required: true,
    },
  ];
}

export interface CalculatedPrice {
  base: number;
  total: number;
  modifiers: string[];
}

export function calculatePrice(
  answers: WizardAnswers,
  steps: WizardStep[],
  packages: WizardPackage[],
  selectedPackage: string
): CalculatedPrice {
  const pkg = packages.find((p) => p.id === selectedPackage);
  if (!pkg) return { base: 0, total: 0, modifiers: [] };

  const basePrice = extractPrice(pkg.price);
  let totalModifier = 0;
  const modifiers: string[] = [];

  Object.entries(answers).forEach(([stepId, value]) => {
    const stepConfig = steps.find((s) => s.id === stepId);
    if (!stepConfig?.options) return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach((v) => {
      const option = stepConfig.options?.find((o) => o.id === v);
      if (option?.priceModifier) {
        totalModifier += option.priceModifier;
        modifiers.push(
          `${option.label}: ${option.priceModifier > 0 ? "+" : ""}${option.priceModifier}%`
        );
      }
    });
  });

  return { base: basePrice, total: Math.round(basePrice * (1 + totalModifier / 100)), modifiers };
}

export function calculateTimeline(
  answers: WizardAnswers,
  steps: WizardStep[],
  packages: WizardPackage[],
  selectedPackage: string
): number {
  const pkg = packages.find((p) => p.id === selectedPackage);
  if (!pkg) return 14;

  const timelineFeature = pkg.features.find((f) => f.includes("дн") || f.includes("день"));
  let baseDays = 14;
  if (timelineFeature) {
    const match = timelineFeature.match(/(\d+)/);
    if (match) baseDays = parseInt(match[1], 10);
  }

  let modifier = 0;
  Object.entries(answers).forEach(([stepId, value]) => {
    const stepConfig = steps.find((s) => s.id === stepId);
    if (!stepConfig?.options) return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach((v) => {
      const option = stepConfig.options?.find((o) => o.id === v);
      if (option?.timeModifier) modifier += option.timeModifier;
    });
  });

  return Math.max(5, baseDays + modifier);
}

export function buildTelegramMessage(
  answers: WizardAnswers,
  steps: WizardStep[],
  packages: WizardPackage[],
  selectedPackage: string,
  productTitle: string,
  totalPrice: number,
  timeline: number
): string {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const parts = [
    `🎯 ${productTitle}`,
    `📦 Тариф: ${pkg?.name}`,
    `💰 Расчёт: от ${formatPrice(totalPrice)} ₽`,
    `⏱️ Срок: ~${timeline} дней`,
    "",
  ];

  Object.entries(answers).forEach(([stepId, value]) => {
    const stepConfig = steps.find((s) => s.id === stepId);
    if (!stepConfig) return;
    if (stepConfig.type === "text" || stepConfig.type === "textarea") {
      parts.push(`• ${stepConfig.title}: ${value}`);
    } else if (stepConfig.options) {
      const values = Array.isArray(value) ? value : [value];
      const labels = values.map((v) => {
        const opt = stepConfig.options?.find((o) => o.id === v);
        return opt ? `${opt.emoji} ${opt.label}` : v;
      });
      parts.push(`• ${stepConfig.title}: ${labels.join(", ")}`);
    }
  });

  return encodeURIComponent(parts.join("\n"));
}
