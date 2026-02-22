import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Check, Globe, MessageSquare, Video, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
// Removed unused import - redirecting directly to Telegram
import { toast } from "@/hooks/use-toast";

const products = [
  {
    id: "website",
    name: "Разработка сайтов",
    icon: Globe,
    price: "от 55 000 ₽",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "telegram-bot",
    name: "Боты и Mini Apps",
    icon: MessageSquare,
    price: "от 35 000 ₽",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "ai-video",
    name: "AI-видео",
    icon: Video,
    price: "от 5 000 ₽",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    id: "ai-agent",
    name: "AI-ассистент",
    icon: Bot,
    price: "от 65 000 ₽",
    gradient: "from-purple-600 to-violet-800",
  },
];

interface QuickOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: string;
}

export const QuickOrderForm = ({ isOpen, onClose, preselectedProduct }: QuickOrderFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>(preselectedProduct || "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast({
        title: "Выберите продукт",
        description: "Пожалуйста, выберите интересующий продукт",
        variant: "destructive",
      });
      return;
    }

    const productName = products.find((p) => p.id === selectedProduct)?.name || selectedProduct;
    const sanitizedComment = comment.trim().replace(/<[^>]*>/g, '').slice(0, 500);
    
    // Format message for Telegram
    const message = `🛒 Быстрый заказ: ${productName}${sanitizedComment ? `\n\n💬 Комментарий: ${sanitizedComment}` : ""}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Close modal and redirect to Telegram
    onClose();
    window.open(`https://t.me/neeekn?text=${encodedMessage}`, '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="relative w-full md:max-w-lg h-[95vh] md:h-auto md:max-h-[90vh] overflow-y-auto bg-background border-t md:border border-border rounded-t-3xl md:rounded-2xl shadow-2xl touch-pan-x"
          >
            {/* Drag handle for mobile */}
            <div className="flex justify-center pt-2 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 pt-2 md:pt-4 sm:p-5 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Быстрый заказ</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Выберите продукт и оставьте контакт</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success State */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                  >
                    <Check className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-semibold text-foreground">Заявка отправлена!</p>
                  <p className="text-sm text-muted-foreground mt-1">Свяжемся в течение часа</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Выберите продукт *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {products.map((product) => {
                    const Icon = product.icon;
                    const isSelected = selectedProduct === product.id;
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelectedProduct(product.id)}
                        className={cn(
                          "relative p-3 rounded-xl border-2 text-left transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30 bg-surface/50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br",
                          product.gradient
                        )}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.price}</p>
                        
                        {isSelected && (
                          <motion.div
                            layoutId="selectedProduct"
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="quick-name" className="block text-sm font-medium text-foreground mb-1.5">
                  Ваше имя *
                </label>
                <input
                  id="quick-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="quick-contact" className="block text-sm font-medium text-foreground mb-1.5">
                  Телефон или Telegram *
                </label>
                <input
                  id="quick-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+7 (999) 123-45-67 или @username"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="quick-comment" className="block text-sm font-medium text-foreground mb-1.5">
                  Комментарий <span className="text-muted-foreground">(опционально)</span>
                </label>
                <textarea
                  id="quick-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Кратко опишите задачу..."
                  maxLength={500}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
                  "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Отправить заявку
                  </>
                )}
              </button>

              {/* Telegram link */}
              <p className="text-center text-xs text-muted-foreground">
                Или напишите напрямую:{" "}
                <a
                  href="https://t.me/neeekn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @neeekn
                </a>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
