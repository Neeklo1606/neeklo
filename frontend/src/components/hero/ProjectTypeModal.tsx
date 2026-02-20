import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Video, Smartphone, Bot, MoreHorizontal } from "lucide-react";

const PROJECT_TYPES = [
  { id: "site", label: "Сайт", icon: Globe },
  { id: "video", label: "Видео", icon: Video },
  { id: "miniapp", label: "Mini App", icon: Smartphone },
  { id: "ai", label: "AI-агент", icon: Bot },
] as const;

const CARD_CLASS =
  "relative overflow-hidden flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-white/50 bg-white/60 backdrop-blur-xl transition-all duration-200 cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] text-[#0F172A] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-transparent before:opacity-60 before:pointer-events-none before:z-0";

interface ProjectTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (type: string) => void;
}

export function ProjectTypeModal({
  open,
  onOpenChange,
  onSelect,
}: ProjectTypeModalProps) {
  const handleSelect = (typeId: string) => {
    onSelect?.(typeId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-white/10 bg-black/90 backdrop-blur-xl p-6 text-white [&>button]:text-white [&>button]:hover:text-white/90 [&>button]:right-4 [&>button]:top-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold text-white">
            Выберите тип проекта
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {PROJECT_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className={CARD_CLASS}
              aria-label={label}
            >
              <span className="relative z-10 flex flex-col items-center gap-2">
                <Icon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                <span className="font-medium">{label}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelect("other")}
            className={`${CARD_CLASS} col-span-2`}
            aria-label="Другое"
          >
            <span className="relative z-10 flex flex-col items-center gap-2">
              <MoreHorizontal className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
              <span className="font-medium">Другое</span>
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
