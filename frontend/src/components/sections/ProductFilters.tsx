"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Bot, 
  Video, 
  Zap, 
  Smartphone, 
  Layers,
  ArrowRight
} from "lucide-react";

const products = [
  {
    id: "all",
    label: "Все",
    icon: null,
  },
  {
    id: "website",
    label: "Сайты",
    icon: Globe,
    href: "/products/website",
    description: "Лендинги и веб-приложения",
    price: "от 50 000 ₽",
  },
  {
    id: "bot",
    label: "Боты",
    icon: Bot,
    href: "/products/telegram-bot",
    description: "Telegram боты и MiniApp",
    price: "от 30 000 ₽",
  },
  {
    id: "video",
    label: "Видео",
    icon: Video,
    href: "/products/ai-video",
    description: "AI-видео и анимации",
    price: "от 15 000 ₽",
  },
  {
    id: "automation",
    label: "Автоматизация",
    icon: Zap,
    href: "/products/automation",
    description: "AI-агенты и интеграции",
    price: "от 40 000 ₽",
  },
  {
    id: "app",
    label: "Приложения",
    icon: Smartphone,
    href: "/products/mini-app",
    description: "PWA и мобильные приложения",
    price: "от 80 000 ₽",
  },
  {
    id: "ecosystem",
    label: "Экосистема",
    icon: Layers,
    href: "/products/ecosystem",
    description: "Полный digital-комплекс",
    price: "от 150 000 ₽",
  },
];

export function ProductFilters() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = products.filter(p => p.id !== "all" && (activeFilter === "all" || p.id === activeFilter));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-6">
        Выберите продукт
      </h2>

      {/* Filter Pills */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center sm:flex-wrap sm:overflow-visible">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setActiveFilter(product.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              activeFilter === product.id
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              {product.icon && <product.icon className="w-4 h-4" />}
              {product.label}
            </span>
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to={product.href || "#"}
              className="block p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                  {product.icon && <product.icon className="w-5 h-5 text-primary" />}
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{product.label}</h3>
              <p className="text-sm text-neutral-400 mb-3">{product.description}</p>
              <p className="text-sm font-medium text-primary">{product.price}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
