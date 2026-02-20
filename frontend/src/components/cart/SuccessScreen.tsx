import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export function SuccessScreen() {
  const { isSuccessOpen, lastOrderId, lastOrderTotal, closeSuccess } =
    useCart();

  return (
    <AnimatePresence>
      {isSuccessOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[600] bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8"
        >
          <div className="text-5xl mb-6">✅</div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#0a0a0a] dark:text-white mb-3 leading-tight">
            Заказ оформлен!
          </h1>
          <p className="text-[#6b6b6b] dark:text-white/60 font-light max-w-[360px] mx-auto mb-8 leading-relaxed">
            Мы уже видим ваш заказ и свяжемся в течение часа. Ниже — ваш личный
            кабинет.
          </p>
          {lastOrderId != null && lastOrderTotal != null && (
            <div
              className={cn(
                "w-full max-w-[380px] rounded-2xl p-7 md:p-9 mb-6 text-left",
                "bg-[#f5f5f3] dark:bg-white/5 border border-[#e8e8e5] dark:border-white/10"
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] flex items-center justify-center font-semibold text-base">
                  KL
                </div>
                <div>
                  <div className="font-semibold text-[#0a0a0a] dark:text-white text-sm">
                    Клиент
                  </div>
                  <div className="text-xs text-[#6b6b6b] dark:text-white/50">
                    client@email.com
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-white/5 border border-[#e8e8e5] dark:border-white/10 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-[#6b6b6b] dark:text-white/50 uppercase tracking-wider">
                    Заказ {lastOrderId}
                  </span>
                  <span className="text-[10px] bg-[#c8ff00] text-[#0a0a0a] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    В работе
                  </span>
                </div>
                <div className="text-sm text-[#6b6b6b] dark:text-white/60 leading-relaxed">
                  Услуги в заказе
                </div>
                <div className="font-semibold text-sm mt-2 text-[#0a0a0a] dark:text-white">
                  {fmt(lastOrderTotal)}
                </div>
              </div>
              <p className="text-xs text-[#6b6b6b] dark:text-white/50 leading-relaxed">
                Мы свяжемся с вами для уточнения деталей и старта работ.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={closeSuccess}
            className={cn(
              "py-3 px-7 rounded-full font-normal text-sm",
              "bg-transparent border-[1.5px] border-[#e8e8e5] dark:border-white/20",
              "text-[#0a0a0a] dark:text-white",
              "hover:border-[#0a0a0a] dark:hover:border-white transition-colors"
            )}
          >
            ← Вернуться на сайт
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
