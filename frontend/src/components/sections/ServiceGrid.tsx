import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  ClipboardList, 
  Bot, 
  Brain, 
  Video, 
  Smartphone, 
  Cog, 
  MapPin,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceItem {
  id: number;
  title: string;
  icon: any;
  slug: string;
  color: string;
}

const services: ServiceItem[] = [
  {
    id: 1,
    title: "Сайты",
    icon: Globe,
    slug: "website",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: 2,
    title: "CRM",
    icon: ClipboardList,
    slug: "crm",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: 3,
    title: "Боты",
    icon: Bot,
    slug: "telegram-bot",
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: 4,
    title: "AI-агент",
    icon: Brain,
    slug: "ai-agent",
    color: "from-purple-400 to-violet-500",
  },
  {
    id: 5,
    title: "Видео",
    icon: Video,
    slug: "ai-video",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 6,
    title: "MiniApp",
    icon: Smartphone,
    slug: "mini-app",
    color: "from-orange-400 to-amber-500",
  },
  {
    id: 7,
    title: "Авто",
    icon: Cog,
    slug: "automation",
    color: "from-slate-400 to-zinc-500",
  },
  {
    id: 8,
    title: "Карты",
    icon: MapPin,
    slug: "consulting",
    color: "from-red-400 to-orange-500",
  },
];

export const ServiceGrid = memo(function ServiceGrid() {
  return (
    <div className="mt-4">
      {/* Section Label */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Все услуги
        </h3>
        <Link 
          to="/products" 
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Все
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
            >
              <Link
                to={`/products/${service.slug}`}
                className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card hover:bg-accent/50 border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-200 group h-[88px] sm:h-[100px]"
              >
                {/* Icon Container */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md md:group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                {/* Title */}
                <span className="text-[11px] sm:text-xs text-center font-medium text-foreground/80 leading-tight">
                  {service.title}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
