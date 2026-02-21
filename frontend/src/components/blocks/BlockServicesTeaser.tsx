import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const iconStroke = "currentColor";
/* Icons (light minimal style) — цвет через родителя (text-primary) */
function IconSite() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <rect x="2" y="5" width="24" height="18" rx="3" stroke={iconStroke} strokeWidth="2" />
      <path d="M2 10h24" stroke={iconStroke} strokeWidth="2" />
      <circle cx="6" cy="7.5" r="1" fill={iconStroke} />
      <circle cx="10" cy="7.5" r="1" fill={iconStroke} />
      <circle cx="14" cy="7.5" r="1" fill={iconStroke} />
      <path d="M7 15h6M7 18.5h10" stroke={iconStroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconMiniApp() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <rect x="7" y="2" width="14" height="24" rx="3.5" stroke={iconStroke} strokeWidth="2" />
      <circle cx="14" cy="22" r="1.2" fill={iconStroke} />
      <path d="M11 7h6M11 10.5h4" stroke={iconStroke} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 14.5l2 2 4-4" stroke={iconStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <rect x="2" y="7" width="17" height="14" rx="3" stroke={iconStroke} strokeWidth="2" />
      <path d="M19 11l7-4v14l-7-4V11z" stroke={iconStroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l5 2-5 2v-4z" fill={iconStroke} />
    </svg>
  );
}
function IconBot() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
      <rect x="5" y="11" width="18" height="13" rx="4" stroke={iconStroke} strokeWidth="2" />
      <circle cx="10.5" cy="17" r="1.8" fill={iconStroke} />
      <circle cx="17.5" cy="17" r="1.8" fill={iconStroke} />
      <path d="M14 2v5" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="8" r="2.5" stroke={iconStroke} strokeWidth="1.8" />
      <path d="M11 21.5h6" stroke={iconStroke} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 16h3M23 16h3" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS = [
  { Icon: IconSite, label: "Сайт", href: "/services/sites", hit: false },
  { Icon: IconMiniApp, label: "Mini App", href: "/services/mini-app", hit: true },
  { Icon: IconVideo, label: "AI-видео", href: "/services/ai-video", hit: false },
  { Icon: IconBot, label: "Чат-бот", href: "/services/chatbot", hit: false },
];

import type { CmsBlock } from "./BlockRenderer";

export function BlockServicesTeaser({ block }: { block: CmsBlock }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-background py-10 min-[1024px]:py-20" aria-label="Услуги">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 min-[768px]:grid-cols-4 gap-4 sm:gap-6">
          {ITEMS.map((card, index) => (
            <div
              key={card.label}
              className={`io-animate io-fade-in ${isVisible ? "io-visible" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link
                to={card.href}
                className="services-teaser-card flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
                  <card.Icon />
                </div>
                <div className="flex items-center justify-center gap-2 font-bold text-foreground tracking-tight text-[13.5px] sm:text-base">
                  {card.label}
                  {card.hit && (
                    <span className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                      хит
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
