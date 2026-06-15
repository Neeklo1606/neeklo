import { useState, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import {
  generateSteps,
  calculatePrice,
  calculateTimeline,
  buildTelegramMessage,
} from "@/components/product/wizardData";
import type { WizardAnswers, WizardPackage } from "@/components/product/wizardTypes";

interface UseWizardStateOptions {
  productSlug: string;
  packages: WizardPackage[];
  telegramLink: string;
  productTitle: string;
  onClose: () => void;
}

export function useWizardState({
  productSlug,
  packages,
  telegramLink,
  productTitle,
  onClose,
}: UseWizardStateOptions) {
  const steps = useMemo(() => generateSteps(productSlug), [productSlug]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [selectedPackage, setSelectedPackage] = useState<string>(
    packages[1]?.id ?? packages[0]?.id ?? ""
  );
  const [isSending, setIsSending] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const canProceed = useMemo(() => {
    if (!step.required) return true;
    const answer = answers[step.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return !!answer && answer.toString().trim().length > 0;
  }, [step, answers]);

  const calculatedPrice = useMemo(
    () => calculatePrice(answers, steps, packages, selectedPackage),
    [answers, steps, packages, selectedPackage]
  );

  const calculatedTimeline = useMemo(
    () => calculateTimeline(answers, steps, packages, selectedPackage),
    [answers, steps, packages, selectedPackage]
  );

  const handleSingleSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [step.id]: value }));
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      }, 300);
    },
    [step, currentStep, steps.length]
  );

  const handleMultiSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => {
        const current = (prev[step.id] as string[]) || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [step.id]: updated };
      });
    },
    [step]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [step.id]: value }));
    },
    [step]
  );

  const handleNext = useCallback(() => {
    if (canProceed && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (isLastStep && canProceed) {
      setShowSummary(true);
    }
  }, [canProceed, currentStep, steps.length, isLastStep]);

  const handleBack = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [showSummary, currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSending(true);
    try {
      const message = buildTelegramMessage(
        answers,
        steps,
        packages,
        selectedPackage,
        productTitle,
        calculatedPrice.total,
        calculatedTimeline
      );
      window.open(`${telegramLink}?text=${message}`, "_blank");

      toast({
        title: "Отлично!",
        description: "Открываем Telegram для связи",
      });

      // onClose called here — 1 second after successful submit (same as original)
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Ошибка",
        description: "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }, [
    answers,
    steps,
    packages,
    selectedPackage,
    productTitle,
    telegramLink,
    calculatedPrice.total,
    calculatedTimeline,
    onClose,
  ]);

  return {
    // state
    steps,
    step,
    currentStep,
    answers,
    setAnswers,
    selectedPackage,
    setSelectedPackage,
    isSending,
    showSummary,
    // derived
    progress,
    isLastStep,
    canProceed,
    calculatedPrice,
    calculatedTimeline,
    // handlers
    handleSingleSelect,
    handleMultiSelect,
    handleTextChange,
    handleNext,
    handleBack,
    handleSubmit,
  };
}
