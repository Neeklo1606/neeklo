import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart, type CartServiceItem } from "@/context/CartContext";
import { getServiceIcon } from "./ServiceIcon";
import { cn } from "@/lib/utils";

export interface ServiceForDrawer {
  id: number;
  slug: string;
  title: string;
  short?: string;
  price_from?: number;
  media_collections?: { cover?: Array<{ url: string }> };
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

interface ServiceDetailDrawerProps {
  service: ServiceForDrawer | null;
  onClose: () => void;
}

export function ServiceDetailDrawer({ service, onClose }: ServiceDetailDrawerProps) {
  const { addToCart, isInCart, openCart } = useCart();
  const open = !!service;

  const handleAddToCart = () => {
    if (!service) return;
    const item: CartServiceItem = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      short: service.short,
      price_from: service.price_from ?? 0,
      media_collections: service.media_collections,
    };
    addToCart(item);
    openCart();
    onClose();
  };

  const handleGoToCheckout = () => {
    if (!service) return;
    const item: CartServiceItem = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      short: service.short,
      price_from: service.price_from ?? 0,
      media_collections: service.media_collections,
    };
    addToCart(item);
    onClose();
    setTimeout(openCart, 300);
  };

  const Icon = service ? getServiceIcon(service.slug) : null;

  return (
    <AnimatePresence>
      {open && service && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[400] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[401] bg-background border-l border-border flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Услуга</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="rounded-2xl overflow-hidden bg-muted aspect-video mb-6 flex items-center justify-center">
                {service.media_collections?.cover?.[0]?.url ? (
                  <img
                    src={service.media_collections.cover[0].url}
                    alt=""
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  Icon && <Icon className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {service.title}
              </h1>
              {service.short && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.short}
                </p>
              )}
              {service.price_from != null && (
                <p className="text-xl font-bold text-primary mb-6">
                  от {fmt(service.price_from)}
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-8">
                <strong>Шаг 1:</strong> выберите услугу. <strong>Шаг 2:</strong> оформите заказ в корзине и оплатите на сайте — мы свяжемся в тот же день.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    "w-full py-4 rounded-xl font-semibold transition-all",
                    isInCart(service.id)
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {isInCart(service.id) ? "✓ В корзине" : "+ В корзину"}
                </button>
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full py-4 rounded-xl font-semibold bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Оформить заказ
                  <span className="opacity-80">↗</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
