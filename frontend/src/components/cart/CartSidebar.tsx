import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export function CartSidebar() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    checkout,
    total,
    closeCart,
  } = useCart();

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[500]"
            onClick={closeCart}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ x: isCartOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed right-0 top-0 bottom-0 w-full max-w-[420px] z-[501]",
          "bg-white dark:bg-[#0a0a0a] border-l border-[#e8e8e5] dark:border-white/10",
          "flex flex-col shadow-xl"
        )}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#e8e8e5] dark:border-white/10">
          <h2 className="font-serif text-2xl font-normal text-[#0a0a0a] dark:text-white">
            Корзина
          </h2>
          <button
            type="button"
            onClick={toggleCart}
            className="w-9 h-9 rounded-full bg-[#f5f5f3] dark:bg-white/10 flex items-center justify-center text-lg hover:bg-[#e8e8e5] dark:hover:bg-white/20 transition-colors"
            aria-label="Закрыть корзину"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-14 text-[#6b6b6b] dark:text-white/60 text-sm">
              <div className="text-4xl mb-4 flex justify-center">
                <ShoppingCart className="w-12 h-12 opacity-50" />
              </div>
              Корзина пуста.<br />
              Выберите услугу ниже.
            </div>
          ) : (
            <ul className="space-y-0">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-[#e8e8e5] dark:border-white/10 last:border-0"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f5f5f3] dark:bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {item.media_collections?.cover?.[0]?.url ? (
                      <img
                        src={item.media_collections.cover[0].url}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#0a0a0a] dark:text-white text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#6b6b6b] dark:text-white/50 mt-0.5">
                      от {fmt(item.price_from)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm whitespace-nowrap text-[#0a0a0a] dark:text-white">
                      {fmt(item.price_from)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#ccc] hover:text-[#0a0a0a] dark:hover:text-white text-base p-1 transition-colors"
                      aria-label={`Удалить ${item.title}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-5 pt-4 border-t border-[#e8e8e5] dark:border-white/10">
          {cart.length > 0 && (
            <div className="mb-5 space-y-1">
              <div className="flex justify-between text-sm text-[#6b6b6b] dark:text-white/60 py-1">
                <span>Услуг:</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-3 mt-2 border-t border-[#e8e8e5] dark:border-white/10">
                <span className="text-[#0a0a0a] dark:text-white">Итого</span>
                <span className="text-[#0a0a0a] dark:text-white">{fmt(total)}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={checkout}
            disabled={cart.length === 0}
            className={cn(
              "w-full py-4 rounded-xl font-medium text-base",
              "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a]",
              "hover:bg-[#333] dark:hover:bg-white/90 transition-colors",
              "disabled:bg-[#ccc] dark:disabled:bg-white/30 disabled:cursor-not-allowed disabled:text-[#666]"
            )}
          >
            Оформить заказ →
          </button>
          <p className="text-[11px] text-[#6b6b6b] dark:text-white/50 text-center mt-3 leading-snug">
            Мы свяжемся с вами в течение часа после оформления
          </p>
        </div>
      </motion.aside>
    </>
  );
}
