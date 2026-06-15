"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
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
              <span className="text-sm font-medium text-muted-foreground">
                {productTitle}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                <WizardSummary
                  steps={steps}
                  answers={answers}
                  packages={packages}
                  selectedPackage={selectedPackage}
                  calculatedPrice={calculatedPrice}
                  calculatedTimeline={calculatedTimeline}
                  isSending={isSending}
                  productTitle={productTitle}
                  onContactChange={(v) => setAnswers((prev) => ({ ...prev, contact: v }))}
                  onPackageChange={setSelectedPackage}
                  onSubmit={handleSubmit}
                />
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
