import {
  Globe,
  Bot,
  Video,
  LayoutGrid,
  ShoppingCart,
  MessageCircle,
  Sparkles,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const slugToIcon: Record<string, LucideIcon> = {
  "veb-sajty": Globe,
  "veb-sajty-i-lendingi": Globe,
  landing: Globe,
  website: Globe,
  "telegram-bot": Bot,
  bot: Bot,
  bots: Bot,
  "ai-video": Video,
  video: Video,
  "mini-app": Smartphone,
  "telegram-mini-app": Smartphone,
  miniapp: Smartphone,
  "ui-ux": LayoutGrid,
  design: LayoutGrid,
  "internet-magazin": ShoppingCart,
  shop: ShoppingCart,
  crm: MessageCircle,
  automation: Workflow,
  "ai-agent": Sparkles,
  branding: LayoutGrid,
};

const defaultIcon = Globe;

export function getServiceIcon(slug: string): LucideIcon {
  const lower = slug.toLowerCase().replace(/\s+/g, "-");
  return slugToIcon[lower] ?? slugToIcon[Object.keys(slugToIcon).find((k) => lower.includes(k)) ?? ""] ?? defaultIcon;
}
