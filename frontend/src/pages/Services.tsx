import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { getPublicServices } from "@/lib/api";
import { getServiceIcon } from "@/components/services/ServiceIcon";
import { ServiceDetailDrawer, type ServiceForDrawer } from "@/components/services/ServiceDetailDrawer";
import { PageSkeleton } from "@/components/common/PageSkeleton";

interface ServiceItem extends ServiceForDrawer {
  media_collections?: { cover?: Array<{ url: string }> };
}

const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const openSlug = (location.state as { openSlug?: string } | null)?.openSlug;

  const { data: list, isLoading, isError } = useQuery({
    queryKey: ["public", "services", "catalog"],
    queryFn: async () => {
      const r = await getPublicServices({ per_page: 100 });
      if (!r.success) throw new Error(r.message || "Ошибка загрузки");
      return (r.data ?? []) as ServiceItem[];
    },
  });

  const services = list ?? [];

  useEffect(() => {
    if (openSlug && services.length > 0) {
      const service = services.find((s) => s.slug === openSlug);
      if (service) setSelectedService(service);
      navigate("/services", { replace: true, state: {} });
    }
  }, [openSlug, services, navigate]);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-28 pb-[max(6rem,env(safe-area-inset-bottom)+4rem)] md:pb-28">
        <Container>
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 md:mb-14"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Услуги
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Каталог услуг из студии — от сайтов и ботов до AI и автоматизации.
            </p>
          </motion.header>

          {isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-muted-foreground">
              Не удалось загрузить список услуг. Проверьте подключение или попробуйте позже.
            </div>
          )}

          {!isError && services.length === 0 && (
            <div className="rounded-xl border border-border bg-muted/30 p-10 text-center text-muted-foreground">
              Пока нет опубликованных услуг. Добавьте их в{" "}
              <a
                href="https://neeklo.ru/admin/services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                админ-панели
              </a>
              .
            </div>
          )}

          {!isError && services.length > 0 && (
            <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {services.map((service, index) => {
                const Icon = getServiceIcon(service.slug);
                return (
                  <motion.button
                    key={service.slug}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    onClick={() => setSelectedService(service)}
                    className={`
                      flex flex-col items-center justify-center
                      rounded-2xl sm:rounded-[22px]
                      min-h-[100px] sm:min-h-[120px] md:min-h-[130px]
                      bg-card border border-border/50
                      hover:border-primary/50 hover:bg-card/80
                      active:scale-[0.98]
                      transition-all duration-200
                      shadow-sm hover:shadow-md
                      p-3 sm:p-4
                    `}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-muted/80 flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0 overflow-hidden">
                      {service.media_collections?.cover?.[0]?.url ? (
                        <img
                          src={service.media_collections.cover[0].url}
                          alt=""
                          width={128}
                          height={128}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
                      {service.title}
                    </span>
                  </motion.button>
                );
              })}
            </section>
          )}
        </Container>
      </main>
      <ServiceDetailDrawer
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
      <Footer />
    </div>
  );
};

export default Services;
