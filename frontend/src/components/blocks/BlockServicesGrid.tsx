import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { useCart, type CartServiceItem } from "@/context/CartContext";
import { getPublicServices } from "@/lib/api";
import { getServiceIcon } from "@/components/services/ServiceIcon";
import { cn } from "@/lib/utils";
import type { CmsBlock } from "./BlockRenderer";

interface ServiceFromApi {
  id: number;
  slug: string;
  title: string;
  short?: string;
  price_from?: number;
  media_collections?: { cover?: Array<{ url: string }> };
}

interface ServicesGridData {
  service_ids?: string[];
  shop_mode?: boolean;
  section_title?: string;
  section_sub?: string;
  /** "cards" | "icons" — карточки с ценой и кнопкой или сетка маленьких иконок как в каталоге */
  layout?: string;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export function BlockServicesGrid({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as ServicesGridData;
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart, openCart } = useCart();
  const isIconLayout = d.layout === "icons";

  const { data: servicesData } = useQuery({
    queryKey: ["public", "services", "grid"],
    queryFn: async () => {
      const r = await getPublicServices({ per_page: 100 });
      return r.success ? r.data : [];
    },
  });

  const services = (servicesData ?? []) as ServiceFromApi[];
  const ids = d.service_ids ?? services.map((s) => s.slug);
  const filtered =
    ids.length > 0
      ? (ids
          .map((id) => services.find((s) => s.slug === id))
          .filter(Boolean) as ServiceFromApi[])
      : services;

  const handleAddToCart = (service: ServiceFromApi) => {
    const item: CartServiceItem = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      short: service.short,
      price_from: service.price_from ?? 0,
      media_collections: service.media_collections,
    };
    if (isInCart(service.id)) {
      removeFromCart(service.id);
      return;
    }
    addToCart(item);
    openCart();
  };

  const showShopMode = d.shop_mode !== false;

  if (isIconLayout) {
    return (
      <section id="services" className="py-16 md:py-20 bg-card text-foreground">
        <Container className="max-w-[1200px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
              {(d.section_title || "Услуги").split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-sm text-muted-foreground max-w-[280px] text-right leading-relaxed">
              {d.section_sub || "Выберите услугу — откроется карточка. В 2 шага можно оформить и оплатить на сайте."}
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((service, index) => {
              const Icon = getServiceIcon(service.slug);
              return (
                <motion.button
                  key={service.slug}
                  type="button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  onClick={() => navigate("/services", { state: { openSlug: service.slug } })}
                  className="flex flex-col items-center justify-center rounded-2xl min-h-[100px] sm:min-h-[115px] bg-muted border border-border hover:border-border hover:shadow-md active:scale-[0.98] transition-all p-3 sm:p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-card flex items-center justify-center mb-2 flex-shrink-0 overflow-hidden shadow-sm">
                    {service.media_collections?.cover?.[0]?.url ? (
                      <img
                        src={service.media_collections.cover[0].url}
                        alt=""
                        width={224}
                        height={224}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
                    {service.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 md:py-20 bg-card text-foreground">
      <Container className="max-w-[1200px]">
        {(d.section_title || showShopMode) && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-tight tracking-tight">
              {(d.section_title || "Выберите услугу").split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            {showShopMode && (
              <p className="text-sm text-muted-foreground max-w-[200px] text-right leading-relaxed">
                {d.section_sub ||
                  "Добавьте в корзину и оформите — мы свяжемся в тот же день"}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((service, index) => (
            <motion.article
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className={cn(
                "rounded-[20px] border-[1.5px] border-border overflow-hidden",
                "bg-card cursor-pointer transition-all duration-250",
                "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
                "relative focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              )}
            >
              <Link
                to={`/services/${service.slug}`}
                className="block group"
              >
                <div className="h-40 flex items-center justify-center bg-muted border-b border-border relative overflow-hidden">
                  {service.media_collections?.cover?.[0]?.url ? (
                    <img
                      src={service.media_collections.cover[0].url}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-4xl opacity-60">📦</span>
                  )}
                  <div
                    className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/5 to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-semibold text-base mb-1.5 tracking-tight">
                    {service.title}
                  </h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 line-clamp-2 font-light">
                    {service.short || ""}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-lg font-semibold tracking-tight">
                      {service.price_from != null ? (
                        <>
                          от {fmt(service.price_from)}{" "}
                          <span className="text-xs text-muted-foreground font-normal">
                            / по запросу
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm font-normal">
                          По запросу
                        </span>
                      )}
                    </div>
                    {showShopMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(service);
                        }}
                        className={cn(
                          "flex items-center gap-1.5 py-2.5 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isInCart(service.id)
                            ? "bg-success text-success-foreground"
                            : "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active"
                        )}
                      >
                        {isInCart(service.id) ? "✓ Добавлено" : "+ В корзину"}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
