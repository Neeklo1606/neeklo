export interface WizardOption {
  id: string;
  emoji: string;
  label: string;
  description?: string;
  priceModifier?: number;
  timeModifier?: number;
}

export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "text" | "textarea";
  options?: WizardOption[];
  placeholder?: string;
  required?: boolean;
}

export interface WizardPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

export type WizardAnswers = Record<string, string | string[]>;
