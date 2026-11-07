import React from "react";
import { Check, Square, CheckSquare } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {step.options?.map((option) => {
            const isSelected = answers[step.id] === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSingleSelect(option.id)}
                className={cn(
                  "min-h-[56px] p-4 rounded-xl border text-left transition-all active:scale-[0.98]",
                  isSelected
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 leading-none mt-0.5">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base leading-snug">{option.label}</p>
                    {option.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      );

    case "multi": {
      const selected = (answers[step.id] as string[]) || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {step.options?.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => onMultiSelect(option.id)}
                className={cn(
                  "min-h-[56px] p-4 rounded-xl border text-left transition-all active:scale-[0.98]",
                  isSelected
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0 leading-none">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base leading-snug">{option.label}</p>
                    {option.priceModifier && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        +{option.priceModifier}% к стоимости
                      </p>
                    )}
                  </div>
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
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
          className="text-base h-14"
          autoFocus
        />
      );

    case "textarea":
      return (
        <Textarea
          value={(answers[step.id] as string) || ""}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={step.placeholder}
          className="min-h-[140px] text-base resize-none"
          autoFocus
        />
      );

    default:
      return null;
  }
}
