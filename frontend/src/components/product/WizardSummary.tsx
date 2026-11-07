import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "./wizardData";
import type { WizardStep, WizardAnswers, WizardPackage } from "./wizardTypes";
import type { CalculatedPrice } from "./wizardData";

export interface WizardSummaryProps {
  steps: WizardStep[];
  answers: WizardAnswers;
  packages: WizardPackage[];
  selectedPackage: string;
  calculatedPrice: CalculatedPrice;
  calculatedTimeline: number;
  isSending: boolean;
  showSuccess: boolean;
  productTitle: string;
  onContactChange: (value: string) => void;
  onPackageChange: (id: string) => void;
  onSubmit: () => void;
}

export function WizardSummary({
  steps,
  answers,
  packages,
  selectedPackage,
  calculatedPrice,
  calculatedTimeline,
  isSending,
  showSuccess,
  onContactChange,
  onPackageChange,
  onSubmit,
}: WizardSummaryProps) {
  const pkg = packages.find((p) => p.id === selectedPackage);
  const contactValue = (answers.contact as string) || "";
  const isPhone = /^[\+\d\(]/.test(contactValue.trim());

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-6 text-center gap-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Заявка отправлена!</h2>
          <p className="text-muted-foreground text-sm">Ответим в течение 2 часов</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 space-y-5"
    >
      {/* Header badge */}
      <div className="text-center space-y-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
        >
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-primary font-medium text-sm">Проект готов к расчёту</span>
        </motion.div>
        <h2 className="text-xl font-bold pt-1">Итоговый расчёт</h2>
      </div>

      {/* Package tabs */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Тариф</p>
        <div className="grid gap-2">
          {packages.map((p) => (
            <button
              key={p.id}
              onClick={() => onPackageChange(p.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                selectedPackage === p.id
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                </div>
                <p className="font-bold text-primary text-sm shrink-0">{p.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="p-4 rounded-xl bg-muted/40 border border-border"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Примерная стоимость</p>
            <p className="text-3xl font-bold">от {formatPrice(calculatedPrice.total)} ₽</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground mb-1">Срок</p>
            <p className="font-semibold">~{calculatedTimeline} дн.</p>
          </div>
        </div>

        {calculatedPrice.modifiers.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Тариф {pkg?.name}:</span>
              <span>{formatPrice(calculatedPrice.base)} ₽</span>
            </div>
            {calculatedPrice.modifiers.map((mod, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-muted-foreground truncate mr-2">{mod.split(":")[0]}:</span>
                <span className="shrink-0">{mod.split(":")[1]}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Contact input */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Ваш контакт
        </p>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {isPhone && contactValue ? (
              <Phone className="w-4 h-4" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
          </div>
          <Input
            value={contactValue}
            onChange={(e) => onContactChange(e.target.value)}
            placeholder="@username или +7..."
            className="h-12 pl-9 text-base"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {contactValue
            ? isPhone
              ? "Позвоним или напишем в WhatsApp"
              : "Напишем в Telegram"
            : "Обязательное поле"}
        </p>
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={isSending || !contactValue.trim()}
        className={cn(
          "w-full h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2",
          contactValue.trim() && !isSending
            ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {isSending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            Отправить заявку в Telegram
          </>
        )}
      </button>

      {/* Collapsible details */}
      <details className="group">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
          Детали заявки
        </summary>
        <div className="mt-2 p-3 rounded-xl bg-muted/30 border border-border/50 space-y-1.5">
          {Object.entries(answers).map(([stepId, value]) => {
            const stepConfig = steps.find((s) => s.id === stepId);
            if (!stepConfig || !value || stepId === "contact") return null;

            let displayValue = "";
            if (stepConfig.type === "text" || stepConfig.type === "textarea") {
              displayValue =
                value.toString().slice(0, 50) +
                (value.toString().length > 50 ? "…" : "");
            } else if (stepConfig.options) {
              const values = Array.isArray(value) ? value : [value];
              displayValue = values
                .map((v) => {
                  const opt = stepConfig.options?.find((o) => o.id === v);
                  return opt ? `${opt.emoji} ${opt.label}` : v;
                })
                .join(", ");
            }

            return (
              <div key={stepId} className="flex justify-between text-xs gap-2">
                <span className="text-muted-foreground shrink-0">{stepConfig.title}:</span>
                <span className="text-right truncate">{displayValue}</span>
              </div>
            );
          })}
        </div>
      </details>
    </motion.div>
  );
}
