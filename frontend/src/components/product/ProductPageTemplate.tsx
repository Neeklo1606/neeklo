import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { PackageConfigurator } from "@/components/product/PackageConfigurator";
import { CompactCases } from "@/components/product/CompactCases";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { useMetaTags } from "@/hooks/useMetaTags";
import productPages from "@/data/productPages.json";
import { cn, scrollToElement } from "@/lib/utils";

import { ChevronLeft, ChevronRight, Home, MessageCircle, Send } from "lucide-react";

interface ProductData {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  timeline?: string;
  telegramLink: string;
  features?: string[];
  audiences: { icon: string; title: string; description: string }[];
  packages: {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string[];
  }[];
  cases: { title: string; result: string; metrics: string[] }[];
  faq: { question: string; answer: string }[];
}

interface ProductPageTemplateProps {
  data: ProductData;
}

export const ProductPageTemplate = ({ data }: ProductPageTemplateProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // SEO meta tags
  useMetaTags(
    `${data.title} — Neeklo Studio`,
    data.subtitle,
    `https://neeklo.ru/og-${data.slug}.jpg`,
    `https://neeklo.ru/products/${data.slug}`,
    `${data.title}, ${data.badge}, Neeklo Studio`
  );

  // Get adjacent products for navigation
  const navigation = useMemo(() => {
    const currentIndex = productPages.findIndex(p => p.slug === data.slug);
    const prevProduct = currentIndex > 0 ? productPages[currentIndex - 1] : null;
    const nextProduct = currentIndex < productPages.length - 1 ? productPages[currentIndex + 1] : null;
    return { prevProduct, nextProduct };
  }, [data.slug]);

  const handlePackageSelect = (packageId: string, packageName: string) => {
    setSelectedPackage(packageId);
    
    // Open Telegram with pre-filled message
    const message = encodeURIComponent(`${data.title} — выбран тариф: ${packageName}`);
    window.open(`${data.telegramLink}?text=${message}`, "_blank");
  };

  // Get starting price from packages
  const startingPrice = data.packages[0]?.price || "по запросу";

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Breadcrumbs — в один ряд, ровно при любом адаптиве: [Home /] [Каталог /] [Название] */}
      <Container className="py-3 md:py-4">
        <nav
          className="flex items-center flex-nowrap overflow-hidden min-w-0 gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground leading-tight"
          aria-label="Хлебные крошки"
        >
          <span className="inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Link
              to="/"
              className="no-min-touch hover:text-foreground transition-colors inline-flex items-center"
              aria-label="На главную"
            >
              <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            </Link>
            <span className="text-muted-foreground/50 select-none">/</span>
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Link to="/products" className="no-min-touch hover:text-foreground transition-colors whitespace-nowrap">
              Каталог
            </Link>
            <span className="text-muted-foreground/50 select-none">/</span>
          </span>
          <span className="min-w-0 overflow-hidden">
            <span className="block truncate text-foreground font-medium">{data.title}</span>
          </span>
        </nav>
      </Container>

      {/* MINIMAL HERO - Что это + Цена + CTA */}
      <section className="py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {data.badge}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {data.title}
              </h1>

              {/* One-liner description */}
              <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                {data.subtitle}
              </p>

              {/* Price + Timeline block */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <span className="text-xl md:text-2xl font-bold text-foreground">
                  {startingPrice}
                </span>
                <span className="text-muted-foreground">
                  · {data.timeline || "Запуск от 5 дней"}
                </span>
              </div>

              {/* Features - Что вы получите */}
              {data.features && data.features.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                  {data.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1.5 rounded-lg bg-foreground/[0.04] dark:bg-white/[0.06] border border-foreground/[0.08] dark:border-white/[0.08] text-sm text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA: слева — Обсудить, справа — всегда В Telegram (та же ссылка, что везде) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
                <a
                  href={`${data.telegramLink}?text=${encodeURIComponent(`Здравствуйте! Интересует ${data.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2",
                    "px-6 py-3.5 rounded-xl",
                    "bg-primary text-primary-foreground",
                    "font-semibold text-base",
                    "hover:bg-primary/90",
                    "transition-all duration-200"
                  )}
                >
                  <MessageCircle className="w-5 h-5" />
                  Обсудить проект
                </a>
                <a
                  href={data.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2",
                    "px-5 py-3 rounded-xl",
                    "text-muted-foreground hover:text-foreground border border-border",
                    "font-medium text-sm",
                    "transition-colors duration-200"
                  )}
                >
                  <Send className="w-4 h-4" />
                  В Telegram
                </a>
                <button
                  onClick={() => scrollToElement('packages', 100, 'smooth')}
                  className="text-sm text-muted-foreground/80 hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Смотреть пакеты
                </button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* PACKAGES - главный блок выбора */}
      <section id="packages">
        <PackageConfigurator
          packages={data.packages}
          onSelect={handlePackageSelect}
        />
      </section>

      {/* CASES - примеры */}
      {data.cases && data.cases.length > 0 && (
        <CompactCases cases={data.cases} />
      )}

      {/* FAQ - короткий */}
      {data.faq && data.faq.length > 0 && (
        <ProductFAQ items={data.faq} />
      )}

      {/* SIMPLE CTA FOOTER */}
      <section className="py-12 md:py-16 bg-muted/30 dark:bg-white/[0.02]">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              Готовы начать?
            </h2>
            <p className="text-muted-foreground mb-6">
              Напишите в Telegram — ответим за 15 минут
            </p>
            <a
              href={data.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2",
                "px-6 py-3.5 rounded-xl",
                "bg-gradient-to-r from-[#0088cc] to-[#00a8e8]",
                "text-white font-semibold",
                "md:hover:scale-[1.02] active:scale-[0.98]",
                "transition-all duration-200"
              )}
            >
              <MessageCircle className="w-5 h-5" />
              Написать в Telegram
            </a>
          </div>
        </Container>
      </section>

      {/* Product Navigation */}
      <section className="py-8 border-t border-border">
        <Container>
          <div className="flex items-center justify-between">
            {navigation.prevProduct ? (
              <Link
                to={`/products/${navigation.prevProduct.slug}`}
                className="flex items-center gap-2 group p-3 rounded-xl hover:bg-muted/50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Назад</p>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                    {navigation.prevProduct.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-sm text-muted-foreground hover:text-foreground"
            >
              Каталог
            </Link>

            {navigation.nextProduct ? (
              <Link
                to={`/products/${navigation.nextProduct.slug}`}
                className="flex items-center gap-2 group p-3 rounded-xl hover:bg-muted/50 transition-all"
              >
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Далее</p>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                    {navigation.nextProduct.title}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};
