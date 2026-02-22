import { memo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { 
  MessageSquare, Bot, Database, Globe, Palette, Code, Rocket, 
  Video, Sparkles, Edit, Settings, Zap, FileText, Users, BarChart,
  Phone, CheckCircle, Briefcase, Lightbulb, Target, Send, Clock
} from "lucide-react";

export interface HowItWorksStep {
  title: string;
  description: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: HowItWorksStep[];
  variant?: "default" | "ai-agent" | "website" | "telegram-bot" | "ai-video" | "automation" | "ecosystem" | "branding" | "crm" | "mobile-app" | "support" | "consulting" | "mini-app";
}

// Icon sets for different product variants
const variantIcons: Record<string, React.ReactNode[]> = {
  "default": [<MessageSquare className="w-6 h-6" />, <Bot className="w-6 h-6" />, <Database className="w-6 h-6" />],
  "ai-agent": [<MessageSquare className="w-6 h-6" />, <Bot className="w-6 h-6" />, <Database className="w-6 h-6" />],
  "website": [<FileText className="w-6 h-6" />, <Palette className="w-6 h-6" />, <Rocket className="w-6 h-6" />],
  "telegram-bot": [<MessageSquare className="w-6 h-6" />, <Settings className="w-6 h-6" />, <Zap className="w-6 h-6" />],
  "mini-app": [<Lightbulb className="w-6 h-6" />, <Code className="w-6 h-6" />, <Rocket className="w-6 h-6" />],
  "ai-video": [<FileText className="w-6 h-6" />, <Sparkles className="w-6 h-6" />, <Video className="w-6 h-6" />],
  "automation": [<BarChart className="w-6 h-6" />, <Settings className="w-6 h-6" />, <Zap className="w-6 h-6" />],
  "ecosystem": [<Target className="w-6 h-6" />, <Code className="w-6 h-6" />, <Globe className="w-6 h-6" />],
  "branding": [<Lightbulb className="w-6 h-6" />, <Palette className="w-6 h-6" />, <CheckCircle className="w-6 h-6" />],
  "crm": [<Users className="w-6 h-6" />, <Settings className="w-6 h-6" />, <BarChart className="w-6 h-6" />],
  "mobile-app": [<Lightbulb className="w-6 h-6" />, <Code className="w-6 h-6" />, <Phone className="w-6 h-6" />],
  "support": [<Phone className="w-6 h-6" />, <Clock className="w-6 h-6" />, <CheckCircle className="w-6 h-6" />],
  "consulting": [<Briefcase className="w-6 h-6" />, <Target className="w-6 h-6" />, <Send className="w-6 h-6" />],
};

// Default steps for each product variant
const defaultSteps: Record<string, HowItWorksStep[]> = {
  "default": [
    { title: "Клиент пишет", description: "Сообщение через Telegram, WhatsApp, сайт или email" },
    { title: "AI отвечает мгновенно", description: "Понимает вопрос и даёт правильный ответ вашим голосом" },
    { title: "Данные в CRM", description: "Всё автоматически в системе. Без ручного ввода" },
  ],
  "ai-agent": [
    { title: "Клиент пишет", description: "Через Telegram, WhatsApp, сайт или email — любой канал" },
    { title: "AI понимает и отвечает", description: "Обученный на ваших данных бот даёт точный ответ за секунды" },
    { title: "Лид в CRM", description: "Контакт и история диалога автоматически сохраняются" },
  ],
  "website": [
    { title: "Заполняете бриф", description: "Отвечаете на 5 вопросов о бизнесе, целях и стиле" },
    { title: "Создаём дизайн", description: "Уникальный макет с адаптивом под все устройства" },
    { title: "Запускаем сайт", description: "Готовый сайт с SEO, аналитикой и формой заявок" },
  ],
  "telegram-bot": [
    { title: "Описываете задачу", description: "Что должен делать бот: заявки, каталог, оплата?" },
    { title: "Настраиваем логику", description: "Сценарии, интеграции с CRM и платёжными системами" },
    { title: "Бот работает 24/7", description: "Принимает заявки и отвечает клиентам без вас" },
  ],
  "mini-app": [
    { title: "Проектируем интерфейс", description: "UI/UX под мобильный опыт внутри Telegram" },
    { title: "Разрабатываем", description: "Авторизация, оплата, личный кабинет — всё в приложении" },
    { title: "Публикуем", description: "Пользователи открывают Mini App прямо в Telegram" },
  ],
  "ai-video": [
    { title: "Присылаете ТЗ", description: "Тема, стиль, примеры — или доверьтесь нам" },
    { title: "AI генерирует", description: "Нейросети создают видео, мы дорабатываем до идеала" },
    { title: "Получаете ролики", description: "Готовые видео для Reels, YouTube или рекламы" },
  ],
  "automation": [
    { title: "Анализируем процессы", description: "Находим рутину, которую можно автоматизировать" },
    { title: "Настраиваем связки", description: "Интеграции между CRM, таблицами, ботами и сервисами" },
    { title: "Работает без вас", description: "Процессы идут автоматически, вы следите за результатами" },
  ],
  "ecosystem": [
    { title: "Аудит бизнеса", description: "Анализируем все точки контакта с клиентом" },
    { title: "Проектируем систему", description: "Сайт + бот + CRM + аналитика в единой связке" },
    { title: "Запускаем экосистему", description: "Все каналы работают синхронно и усиливают друг друга" },
  ],
  "branding": [
    { title: "Изучаем вас", description: "Бриф о ценностях, аудитории и позиционировании" },
    { title: "Создаём стиль", description: "Логотип, цвета, шрифты и все элементы айдентики" },
    { title: "Передаём гайды", description: "Брендбук и файлы для любых носителей" },
  ],
  "crm": [
    { title: "Выбираем систему", description: "Bitrix24, amoCRM или кастомное решение под вас" },
    { title: "Настраиваем воронки", description: "Этапы сделок, автозадачи и интеграции" },
    { title: "Обучаем команду", description: "Ваши менеджеры работают в новой системе с первого дня" },
  ],
  "mobile-app": [
    { title: "Прорабатываем идею", description: "Функции, экраны и путь пользователя" },
    { title: "Разрабатываем", description: "iOS и Android на React Native — один код, две платформы" },
    { title: "Публикуем в сторах", description: "Готовое приложение в App Store и Google Play" },
  ],
  "support": [
    { title: "Подключаемся", description: "Получаем доступы и изучаем ваши системы" },
    { title: "Мониторим 24/7", description: "Следим за работоспособностью и отвечаем на тикеты" },
    { title: "Решаем проблемы", description: "Баги, обновления, улучшения — всё берём на себя" },
  ],
  "consulting": [
    { title: "Созвон-знакомство", description: "Обсуждаем задачи и текущую ситуацию" },
    { title: "Аудит и стратегия", description: "Анализируем и предлагаем план действий" },
    { title: "Дорожная карта", description: "Получаете документ с приоритетами и сроками" },
  ],
};

const subtitles: Record<string, string> = {
  "default": "Три простых шага к автоматизации",
  "ai-agent": "Три шага к вашему AI-ассистенту",
  "website": "Три шага к вашему сайту",
  "telegram-bot": "Три шага к вашему боту",
  "mini-app": "Три шага к вашему Mini App",
  "ai-video": "Три шага к вашим видео",
  "automation": "Три шага к автоматизации",
  "ecosystem": "Три шага к digital-экосистеме",
  "branding": "Три шага к вашему бренду",
  "crm": "Три шага к вашей CRM",
  "mobile-app": "Три шага к вашему приложению",
  "support": "Три шага к надёжной поддержке",
  "consulting": "Три шага к стратегии роста",
};

export const HowItWorks = memo(function HowItWorks({ 
  title = "Как это работает",
  subtitle,
  steps,
  variant = "default"
}: HowItWorksProps) {
  const displaySteps = steps || defaultSteps[variant] || defaultSteps["default"];
  const displaySubtitle = subtitle || subtitles[variant] || subtitles["default"];
  const icons = variantIcons[variant] || variantIcons["default"];

  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-surface/30">
      <Container>
        <motion.div
          className="text-center mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">{displaySubtitle}</p>
        </motion.div>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {displaySteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs lg:text-sm mb-3 lg:mb-4">
                {String(index + 1).padStart(2, "0")}
              </div>
              
              {/* Icon */}
              <div className="flex justify-center mb-2.5 lg:mb-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {icons[index]}
                </div>
              </div>
              
              <h3 className="font-semibold text-foreground text-sm lg:text-base mb-1.5 lg:mb-2">{step.title}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              
              {/* Connector line */}
              {index < displaySteps.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-[60%] w-[80%] h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical stepper - more compact */}
        <div className="md:hidden space-y-0">
          {displaySteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex gap-3 sm:gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Left: Number + Line */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </div>
                {index < displaySteps.length - 1 && (
                  <div className="w-px h-full bg-border min-h-[50px] sm:min-h-[60px]" />
                )}
              </div>
              
              {/* Right: Content */}
              <div className="pb-4 sm:pb-6 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {icons[index]}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-[42px] sm:pl-[52px]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
});
