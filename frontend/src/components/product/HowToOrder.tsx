"use client";

import { motion } from "framer-motion";
import { MessageCircle, Send, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface HowToOrderProps {
  telegramLink?: string;
  productTitle: string;
}

export function HowToOrder({
  telegramLink = "https://t.me/neeekn",
  productTitle,
}: HowToOrderProps) {
  const handleTelegram = () => {
    const message = encodeURIComponent(`Здравствуйте! Интересует ${productTitle}`);
    window.open(`${telegramLink}?text=${message}`, "_blank");
  };

  const steps = [
    {
      icon: MessageCircle,
      title: "Выберите пакет",
      description: "Определитесь с форматом",
    },
    {
      icon: Send,
      title: "Напишите нам",
      description: "В Telegram или оставьте контакт",
    },
    {
      icon: Rocket,
      title: "Запускаем",
      description: "Начинаем работу за 24 часа",
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-muted/20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Как заказать
          </h2>
          <p className="text-sm text-muted-foreground">
            Три простых шага до запуска
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={cn(
                "relative p-5 rounded-xl",
                "bg-background border border-border/50",
                "text-center"
              )}
            >
              {/* Step number */}
              <div className="absolute -top-3 left-4">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleTelegram}
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "px-6 py-3 rounded-xl",
              "bg-primary text-primary-foreground",
              "font-medium text-sm",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            <Send className="w-4 h-4" />
            Написать в Telegram
          </button>
        </div>
      </div>
    </section>
  );
}
