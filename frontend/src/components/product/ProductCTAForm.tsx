import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Send, Check } from "lucide-react";

interface ProductCTAFormProps {
  title?: string;
  subtitle?: string;
  productName: string;
  packages: { id: string; name: string }[];
  selectedPackage?: string;
  telegramLink?: string;
}

export const ProductCTAForm = ({
  title = "Хотите такой же результат?",
  subtitle = "Оставьте контакт — предложим варианты под ваш бюджет",
  productName,
  packages,
  selectedPackage,
  telegramLink = "https://t.me/neeekn",
}: ProductCTAFormProps) => {
  const [formData, setFormData] = useState({
    package: selectedPackage || packages[0]?.id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPkg = packages.find((p) => p.id === formData.package);
    
    // Format message for Telegram
    const message = `Продукт: ${productName}\nПакет: ${selectedPkg?.name || "Не выбран"}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Redirect to Telegram
    window.open(`https://t.me/neeekn?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      <section className="py-10 sm:py-12 md:py-16">
      <Container>
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Начните проект</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{subtitle}</p>
          </div>

          {/* Form */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-4 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Package Selection - Game Style Buttons */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Выберите пакет
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, package: pkg.id })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group active:scale-[0.98] ${
                        formData.package === pkg.id
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.package === pkg.id 
                              ? "border-primary bg-primary" 
                              : "border-muted-foreground"
                          }`}>
                            {formData.package === pkg.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary-foreground rounded-full"
                              />
                            )}
                          </div>
                          <span className={`font-medium transition-colors ${
                            formData.package === pkg.id ? "text-primary" : "text-foreground"
                          }`}>
                            {productName} — {pkg.name}
                          </span>
                        </div>
                        
                        {/* Checkmark */}
                        {formData.package === pkg.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button - Direct Telegram Link */}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 md:h-14 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Send size={18} />
                Обсудить проект
              </motion.button>
            </form>

            {/* Alternative */}
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Или напишите напрямую в{" "}
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <Send size={12} />
                Telegram
              </a>
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
    </>
  );
};
