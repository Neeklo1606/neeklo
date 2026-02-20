import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Icons (light minimal style) */
function IconSite({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="24" height="18" rx="3" stroke={color} strokeWidth="2" />
      <path d="M2 10h24" stroke={color} strokeWidth="2" />
      <circle cx="6" cy="7.5" r="1" fill={color} />
      <circle cx="10" cy="7.5" r="1" fill={color} />
      <circle cx="14" cy="7.5" r="1" fill={color} />
      <path d="M7 15h6M7 18.5h10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconMiniApp({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="2" width="14" height="24" rx="3.5" stroke={color} strokeWidth="2" />
      <circle cx="14" cy="22" r="1.2" fill={color} />
      <path d="M11 7h6M11 10.5h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 14.5l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconVideo({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="17" height="14" rx="3" stroke={color} strokeWidth="2" />
      <path d="M19 11l7-4v14l-7-4V11z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l5 2-5 2v-4z" fill={color} />
    </svg>
  );
}
function IconBot({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="18" height="13" rx="4" stroke={color} strokeWidth="2" />
      <circle cx="10.5" cy="17" r="1.8" fill={color} />
      <circle cx="17.5" cy="17" r="1.8" fill={color} />
      <path d="M14 2v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="8" r="2.5" stroke={color} strokeWidth="1.8" />
      <path d="M11 21.5h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 16h3M23 16h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS = [
  { Icon: IconSite, label: "Сайт", href: "/services/sites", ac: "#3B82F6", bg: "rgba(59,130,246,.09)" },
  { Icon: IconMiniApp, label: "Mini App", href: "/services/mini-app", ac: "#6366F1", bg: "rgba(99,102,241,.09)", hit: true },
  { Icon: IconVideo, label: "AI-видео", href: "/services/ai-video", ac: "#06B6D4", bg: "rgba(6,182,212,.09)" },
  { Icon: IconBot, label: "Чат-бот", href: "/services/chatbot", ac: "#10B981", bg: "rgba(16,185,129,.09)" },
];

import type { CmsBlock } from "./BlockRenderer";

export function BlockServicesTeaser({ block }: { block: CmsBlock }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#F8FAFC] py-10 min-[1024px]:py-20" aria-label="Услуги">
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
                className="services-teaser-card flex flex-col items-center justify-center rounded-2xl border border-[#E8EDF3] bg-white p-5 sm:p-6 md:p-8 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2"
              >
                <div
                  className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px]"
                  style={{ background: card.bg }}
                >
                  <card.Icon color={card.ac} />
                </div>
                <div className="flex items-center justify-center gap-2 font-bold text-[#0F172A] tracking-tight text-[13.5px] sm:text-base">
                  {card.label}
                  {"hit" in card && card.hit && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white"
                      style={{ background: card.ac }}
                    >
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
