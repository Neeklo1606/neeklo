"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Loader2, X,
  CheckCircle2, MessageCircle, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "./wizardData";
import { useWizardState } from "@/hooks/useWizardState";
import type { WizardPackage } from "./wizardTypes";

interface ProductWizardProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productSlug: string;
  packages: WizardPackage[];
  telegramLink: string;
}

export function ProductWizard({
  isOpen,
  onClose,
  productTitle,
  productSlug,
  packages,
  telegramLink,
}: ProductWizardProps) {
  const {
    steps,
    step,
    currentStep,
    answers,
    setAnswers,
    selectedPackage,
    setSelectedPackage,
    isSending,
    showSummary,
    progress,
    isLastStep,
    canProceed,
    calculatedPrice,
    calculatedTimeline,
    handleSingleSelect,
    handleMultiSelect,
    handleTextChange,
    handleNext,
    handleBack,
    handleSubmit,
  } = useWizardState({ productSlug, packages, telegramLink, productTitle, onClose });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && step.type === "text") {
      e.preventDefault();
      handleNext();
    }
  };

  // Render summary
  const renderSummary = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    const contactValue = (answers.contact as string) || "";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-5"
      >
        {/* Header badge */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-primary font-medium text-sm sm:text-base">Заявка готова</span>
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold">Итоговый расчёт</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">Проверьте данные и свяжитесь с нами</p>
        </div>

        {/* Price card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border shadow-xl"
        >
          <div className="text-center space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Примерная стоимость</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary">
              от {formatPrice(calculatedPrice.total)} ₽
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Срок: ~{calculatedTimeline} дней
            </p>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Тариф {pkg?.name}:</span>
              <span className="text-foreground">{formatPrice(calculatedPrice.base)} ₽</span>
            </div>
            {calculatedPrice.modifiers.map((mod, idx) => (
              <div key={idx} className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground truncate mr-2">{mod.split(':')[0]}:</span>
                <span className="text-foreground/80 shrink-0">{mod.split(':')[1]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Package selector */}
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Выберите тариф:</p>
          <div className="grid gap-1.5 sm:gap-2">
            {packages.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPackage(p.id)}
                className={cn(
                  "p-2.5 sm:p-3 rounded-lg sm:rounded-xl border text-left transition-all",
                  selectedPackage === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{p.name}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{p.description}</p>
                  </div>
                  <p className="font-semibold text-primary text-xs sm:text-sm shrink-0">{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact input in summary */}
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ваш контакт:</p>
          <Input
            value={contactValue}
            onChange={(e) => setAnswers(prev => ({ ...prev, contact: e.target.value }))}
            placeholder="@username, телефон или email"
            className="h-10 sm:h-12 text-sm"
          />
        </div>

        {/* Contact buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSending || !contactValue.trim()}
            className={cn(
              "flex items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl text-white transition-colors text-sm sm:text-base",
              contactValue.trim()
                ? "bg-[#0088cc] hover:bg-[#0088cc]/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Telegram</span>
              </>
            )}
          </button>
          <a
            href={`https://wa.me/79999999999?text=${encodeURIComponent(`Заявка на ${productTitle}\nКонтакт: ${contactValue}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-colors text-sm sm:text-base"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">WhatsApp</span>
          </a>
        </div>

        {/* Collapsible details */}
        <details className="group">
          <summary className="text-xs sm:text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-open:rotate-90" />
            Показать детали заявки
          </summary>
          <div className="mt-2 sm:mt-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/30 border border-border/50 space-y-1.5 sm:space-y-2">
            {Object.entries(answers).map(([stepId, value]) => {
              const stepConfig = steps.find(s => s.id === stepId);
              if (!stepConfig || !value || stepId === "contact") return null;

              let displayValue = "";
              if (stepConfig.type === "text" || stepConfig.type === "textarea") {
                displayValue = value.toString().slice(0, 40) + (value.toString().length > 40 ? "..." : "");
              } else if (stepConfig.options) {
                const values = Array.isArray(value) ? value : [value];
                displayValue = values.map(v => {
                  const opt = stepConfig.options?.find(o => o.id === v);
                  return opt ? `${opt.emoji} ${opt.label}` : v;
                }).join(", ");
              }

              return (
                <div key={stepId} className="flex justify-between text-[11px] sm:text-sm gap-2">
                  <span className="text-muted-foreground shrink-0">{stepConfig.title}:</span>
                  <span className="text-right truncate">{displayValue}</span>
                </div>
              );
            })}
          </div>
        </details>
      </motion.div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (step.type) {
      case "single":
        return (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            {step.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSingleSelect(option.id)}
                className={cn(
                  "p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all",
                  answers[step.id] === option.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{option.label}</p>
                    {option.description && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">{option.description}</p>
                    )}
                  </div>
                  {answers[step.id] === option.id && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case "multi": {
        const selected = (answers[step.id] as string[]) || [];
        return (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            {step.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleMultiSelect(option.id)}
                className={cn(
                  "p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all",
                  selected.includes(option.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{option.label}</p>
                    {option.priceModifier && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                        +{option.priceModifier}%
                      </p>
                    )}
                  </div>
                  {selected.includes(option.id) && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );
      }

      case "text":
        return (
          <Input
            value={(answers[step.id] as string) || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={step.placeholder}
            className="text-lg h-14"
            autoFocus
          />
        );

      case "textarea":
        return (
          <Textarea
            value={(answers[step.id] as string) || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={step.placeholder}
            className="min-h-[150px] text-base resize-none"
            autoFocus
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute inset-x-2 top-2 bottom-2 sm:inset-x-4 sm:top-4 sm:bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg md:w-full bg-background rounded-xl sm:rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b shrink-0">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {productTitle}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            {!showSummary && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Шаг {currentStep + 1} из {steps.length}
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {showSummary ? (
                renderSummary()
              ) : (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="text-center space-y-1 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{step.title}</h2>
                    <p className="text-muted-foreground">{step.subtitle}</p>
                  </div>

                  {renderStepContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t shrink-0">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 && !showSummary}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-colors text-sm sm:text-base",
                  currentStep === 0 && !showSummary
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted"
                )}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Назад</span>
              </button>

              {!showSummary && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base",
                    canProceed
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <span>{isLastStep ? "Готово" : "Далее"}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
