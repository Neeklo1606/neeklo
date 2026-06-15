import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WizardStep, WizardAnswers } from "./wizardTypes";

export interface WizardStepContentProps {
  step: WizardStep;
  answers: WizardAnswers;
  onSingleSelect: (value: string) => void;
  onMultiSelect: (value: string) => void;
  onTextChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function WizardStepContent({
  step,
  answers,
  onSingleSelect,
  onMultiSelect,
  onTextChange,
  onKeyDown,
}: WizardStepContentProps) {
  switch (step.type) {
    case "single":
      return (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          {step.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => onSingleSelect(option.id)}
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
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {option.description}
                    </p>
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
              onClick={() => onMultiSelect(option.id)}
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
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={step.placeholder}
          className="text-lg h-14"
          autoFocus
        />
      );

    case "textarea":
      return (
        <Textarea
          value={(answers[step.id] as string) || ""}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={step.placeholder}
          className="min-h-[150px] text-base resize-none"
          autoFocus
        />
      );

    default:
      return null;
  }
}
