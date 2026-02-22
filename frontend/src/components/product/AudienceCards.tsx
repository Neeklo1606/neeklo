import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { ShoppingBag, Briefcase, GraduationCap, Users } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

interface AudienceSegment {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AudienceCardsProps {
  title?: string;
  subtitle?: string;
  segments?: AudienceSegment[];
  onSegmentClick?: (index: number) => void;
}

const defaultSegments: AudienceSegment[] = [
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Интернет-магазины",
    description: "Ответы по товарам, статусы, возвраты",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Услуги",
    description: "Приём заявок и напоминания",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Образование",
    description: "Расписание и записи",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "B2B",
    description: "Типовые вопросы и бриф",
  },
];

export const AudienceCards = ({
  title = "Для кого подходит AI-агент",
  subtitle = "Выберите себя в списке",
  segments = defaultSegments,
  onSegmentClick,
}: AudienceCardsProps) => {
  const handleClick = (index: number) => {
    if (onSegmentClick) {
      onSegmentClick(index);
    }
    scrollToElement("configurator", 100, "smooth");
  };

  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.div
          className="text-center mb-5 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 sm:mb-2">{title}</h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">{subtitle}</p>
        </motion.div>

        {/* 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {segments.map((segment, index) => (
            <motion.button
              key={index}
              className="flex flex-col items-center text-center p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-surface border border-border transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] group min-h-[100px] sm:min-h-[120px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleClick(index)}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-2 sm:mb-3">
                {segment.icon}
              </div>
              <h3 className="font-semibold text-foreground text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 line-clamp-2">{segment.title}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2">{segment.description}</p>
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  );
};