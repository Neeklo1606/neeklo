import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublicServices } from "@/lib/api";
import { BriefWizard } from "@/components/hero/BriefWizard";
import type { CmsBlock } from "./BlockRenderer";

interface ServicesGridData {
  service_ids?: string[];
}

export function BlockServicesGrid({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as ServicesGridData;
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const { data: servicesData } = useQuery({
    queryKey: ["public", "services", "grid"],
    queryFn: async () => {
      const r = await getPublicServices({ per_page: 100 });
      return r.success ? r.data : [];
    },
  });

  const services = (servicesData ?? []) as Array<{
    slug: string;
    title: string;
    short?: string;
    price_from?: number;
  }>;
  const ids = d.service_ids ?? services.map((s) => s.slug);
  const filtered =
    ids.length > 0
      ? (ids.map((id) => services.find((s) => s.slug === id)).filter(Boolean) as typeof services)
      : services;

  return (
    <section className="py-8 md:py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((service, index) => (
            <motion.article
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="h-full flex flex-col"
            >
              <Link
                to={`/products/${service.slug}`}
                className={cn(
                  "group relative h-full flex flex-col rounded-xl p-6 md:p-8",
                  "bg-background border border-border/50 shadow-md card-hover"
                )}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{service.title}</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 flex-1 line-clamp-2">
                  {service.short}
                </p>
                <p className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-6">
                  {service.price_from != null
                    ? `от ${service.price_from.toLocaleString("ru-RU")} ₽`
                    : ""}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsBriefOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-lg text-sm font-medium min-h-[40px] bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-label={`Узнать стоимость: ${service.title}`}
                >
                  Узнать стоимость
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
      <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </section>
  );
}
