import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStepContent } from "./WizardStepContent";
import { WizardSummary } from "./WizardSummary";
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
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMobile(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
    showSuccess,
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
  } = useWizardState({ isOpen, productSlug, packages, telegramLink, productTitle, onClose });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && step.type === "text") {
      e.preventDefault();
      handleNext();
    }
  };

  const canGoBack = currentStep > 0 || showSummary;

  const mobileVariants = {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  };

  const desktopVariants = {
    initial: { opacity: 0, y: 24, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.97 },
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="wizard-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="wizard-modal"
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              isMobile
                ? { type: "spring", damping: 30, stiffness: 300 }
                : { duration: 0.22, ease: "easeOut" }
            }
            className={cn(
              "fixed z-[61] flex flex-col bg-background overflow-hidden",
              // Mobile: bottom sheet
              "inset-x-0 bottom-0 h-[92vh] rounded-t-2xl",
              // Desktop: centered modal
              "md:inset-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "md:h-auto md:max-h-[85vh] md:w-full md:max-w-[640px]",
              "md:rounded-2xl md:border md:shadow-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
              <button
                onClick={handleBack}
                disabled={!canGoBack}
                className={cn(
                  "p-2 rounded-full transition-colors shrink-0",
                  canGoBack ? "hover:bg-muted" : "opacity-20 cursor-not-allowed"
                )}
                aria-label="Назад"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 min-w-0">
                {!showSummary && !showSuccess ? (
                  <>
                    {/* Mobile: progress bar */}
                    <div className="md:hidden h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </div>

                    {/* Desktop: stepper dots */}
                    <div className="hidden md:flex items-center justify-center gap-2">
                      {steps.map((s, i) => (
                        <motion.div
                          key={s.id}
                          animate={{
                            width: i === currentStep ? 20 : 8,
                            opacity: i <= currentStep ? 1 : 0.25,
                          }}
                          transition={{ duration: 0.2 }}
                          className="h-2 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-medium text-center text-muted-foreground">
                    {showSuccess ? "Отправлено" : "Итог"}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {showSummary ? (
                  <WizardSummary
                    key="summary"
                    steps={steps}
                    answers={answers}
                    packages={packages}
                    selectedPackage={selectedPackage}
                    calculatedPrice={calculatedPrice}
                    calculatedTimeline={calculatedTimeline}
                    isSending={isSending}
                    showSuccess={showSuccess}
                    productTitle={productTitle}
                    onContactChange={(v) => setAnswers((prev) => ({ ...prev, contact: v }))}
                    onPackageChange={setSelectedPackage}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="p-4 sm:p-6 space-y-5"
                  >
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold leading-tight">{step.title}</h2>
                      {step.subtitle && (
                        <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                      )}
                    </div>

                    <WizardStepContent
                      step={step}
                      answers={answers}
                      onSingleSelect={handleSingleSelect}
                      onMultiSelect={handleMultiSelect}
                      onTextChange={handleTextChange}
                      onKeyDown={handleKeyDown}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer: Далее button (hidden on summary/success) */}
            {!showSummary && !showSuccess && (
              <div className="px-4 py-4 border-t shrink-0">
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={cn(
                    "w-full h-14 rounded-xl font-semibold text-base transition-all",
                    canProceed
                      ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isLastStep ? "Перейти к итогу" : "Далее"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
