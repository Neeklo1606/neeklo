import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Check } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface PackageConfiguratorProps {
  title?: string;
  subtitle?: string;
  packages: Package[];
  onSelect: (packageId: string, packageName: string) => void;
}

export const PackageConfigurator = ({
  title = "Выберите формат под ваш бизнес",
  subtitle = "Три готовых набора под разные задачи",
  packages,
  onSelect,
}: PackageConfiguratorProps) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Swipe handling for mobile
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && activeIndex < packages.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (direction === "right" && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section id="configurator" className="py-12 md:py-16 bg-surface/30">
      <Container>
        <motion.div
          className="text-center mb-5 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>
        </motion.div>

        {/* Swipeable Tabs - scrollable on mobile */}
        <div 
          ref={tabsRef}
          className="flex justify-center mb-5 sm:mb-6 px-4 -mx-4 sm:mx-0 sm:px-0"
        >
          <div className="inline-flex p-1 rounded-xl bg-background border border-border overflow-x-auto scrollbar-hide max-w-full">
            {packages.map((pkg, index) => (
              <button
                key={pkg.id}
                onClick={() => setActiveIndex(index)}
                className={`relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all min-h-[36px] sm:min-h-[40px] ${
                  activeIndex === index
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeIndex === index && (
                  <motion.div
                    layoutId="activePackageTab"
                    className="absolute inset-0 bg-primary rounded-lg"
                    style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{pkg.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Package Card - responsive padding */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-md mx-auto"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) handleSwipe("left");
              else if (info.offset.x > 50) handleSwipe("right");
            }}
          >
            <div className="bg-background border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">
              {/* Description */}
              <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                {packages[activeIndex].description}
              </p>

              {/* Price */}
              <div className="mb-4 sm:mb-5">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {packages[activeIndex].price}
                </span>
              </div>

              {/* Features checklist */}
              <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                {packages[activeIndex].features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-2.5">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => onSelect(packages[activeIndex].id, packages[activeIndex].name)}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base transition-all hover:bg-primary/90 md:hover:scale-[1.01] active:scale-[0.99] min-h-[44px] sm:min-h-[48px]"
              >
                Выбрать этот пакет
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Swipe indicator for mobile */}
        <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
          {packages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === activeIndex ? "bg-primary" : "bg-border"
              }`}
              aria-label={`Пакет ${index + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};