import { ProjectTypeModal } from "./ProjectTypeModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { smoothScrollToId } from "@/lib/smoothScroll";

const MARQUEE_ITEMS = [
  "BatNorton",
  "СОЮЗ Девелопмент",
  "Акрихин",
  "Первый Медицинский",
  "ПОВУЗАМ",
  "MNKA",
  "Sogu",
  "Свой Хлеб",
  "ANCARS",
  "Bravo Motors",
  "Event-Театр",
  "LiveGrid",
  "МЧС",
  "Суды Санкт-Петербурга",
  "РОСТПОЛИПЛАСТ",
  "ТРК Гулливер",
  "Петроград",
  "arerecase",
];

interface HeroMinimalProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  scrollTargetId?: string;
  videoSrc?: string;
  posterSrc?: string;
}

export function HeroMinimal({
  title = "Создание сайтов,\nвидео и чат-ботов\n(Mini App)",
  subtitle = "Разработка готовых AI-решений для твоего бизнеса.",
  eyebrow = "Digital Studio · 2026",
  ctaPrimary = "Начать проект",
  ctaSecondary: _ctaSecondary,
  scrollTargetId = "contact",
  videoSrc,
  posterSrc,
}: HeroMinimalProps) {
  const [isProjectTypeOpen, setIsProjectTypeOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoCandidates = useMemo(
    () =>
      [
        videoSrc,
        "/frontend/videos/neeklo_hello.mp4",
      ].filter(Boolean) as string[],
    [videoSrc]
  );
  const [videoIndex, setVideoIndex] = useState(0);
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal<HTMLElement>({
    threshold: 0.2,
  });

  useEffect(() => {
    setVideoIndex(0);
  }, [videoSrc]);

  const resolvedVideoSrc = videoCandidates[videoIndex] || "/frontend/videos/neeklo_hello.mp4";

  useEffect(() => {
    const preloadTargets = [resolvedVideoSrc, posterSrc].filter(Boolean) as string[];
    const links: HTMLLinkElement[] = [];

    preloadTargets.forEach((href, idx) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = idx === 0 ? "video" : "image";
      if (idx > 0) link.fetchPriority = "high";
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
    };
  }, [resolvedVideoSrc, posterSrc]);

  // Autoplay: ensure video plays when in view (and on resize/adaptation)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const play = () => {
      el.muted = true;
      el.play().catch(() => {});
    };
    play();
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) play();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    const onResize = () => play();
    window.addEventListener("resize", onResize);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [resolvedVideoSrc]);

  const scrollToSection = (id: string) => {
    smoothScrollToId(id);
  };

  const titleLines = title.split("\n").filter(Boolean).slice(0, 2);

  return (
    <>
      <div className="hero-viewport min-h-0 md:min-h-screen flex flex-col">
        <section
          ref={heroRef}
          id="hero"
          className={`hero-minimal io-animate io-fade-up relative overflow-x-hidden text-foreground flex-1 flex flex-col justify-center isolate min-h-0 max-h-[72vh] md:max-h-none ${heroVisible ? "io-visible" : ""}`}
        >
          {/* Background grid — behind content, no overlap */}
          <div
            className="hero-minimal__grid absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--ink)) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(var(--ink)) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
            aria-hidden
          />
          <div className="hero-minimal__inner relative z-10 flex flex-col lg:grid lg:grid-cols-[1fr_1fr] lg:items-stretch gap-6 lg:gap-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 min-h-0 flex-1 lg:flex-initial justify-center">
            <div className="hero-minimal__left hero-left w-full max-w-[520px] flex flex-col items-center lg:items-start text-center lg:text-left order-1 min-w-0 gap-5 sm:gap-6 lg:gap-6 lg:justify-center">
              <div className="hero-top flex flex-col gap-6 shrink-0 w-full min-w-0">
                <span className="badge hero-badge inline-flex items-center gap-1.5 rounded-full border text-xs font-medium uppercase tracking-wider text-foreground w-fit shrink-0 hero-badge-high">
                <span className="hero-badge-dot h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                {eyebrow}
              </span>
              <h1 className="hero-title w-full min-w-0">
                {titleLines.map((line, i) => (
                  <span key={i} className="hero-line">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="hero-subtitle text-muted-foreground block w-full min-w-0 hero-subtitle-spaced">
                {subtitle}
              </p>
            </div>
            <div className="hero-bottom hidden md:flex flex-wrap gap-3 flex-shrink-0 w-full sm:w-auto" role="group" aria-label="Действия">
              <button
                type="button"
                onClick={() => setIsProjectTypeOpen(true)}
                className="hero-cta-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold text-base bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-colors duration-200 min-h-[44px] w-full sm:w-auto shadow-[var(--glow-accent)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {ctaPrimary}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
          <div className="hero-right hero-video-wrap relative flex justify-center lg:justify-end order-2 px-0 sm:px-2 lg:px-0 -mx-4 sm:mx-0 w-full sm:max-w-full lg:min-h-[70vh]">
            <div className="hero-video-glow" aria-hidden />
            <div className="h-full w-full min-w-0 flex flex-col min-h-[200px] sm:min-h-[280px] lg:min-h-[70vh]">
              <div className="hero-video-container w-full max-w-full flex-1 min-h-[200px] sm:min-h-[280px] lg:min-h-[70vh] overflow-hidden rounded-none sm:rounded-2xl lg:rounded-3xl bg-muted shadow-[var(--shadow-lg)]">
                {resolvedVideoSrc ? (
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    src={resolvedVideoSrc}
                    poster={posterSrc}
                    width={1280}
                    height={720}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onError={() => {
                      setVideoIndex((prev) => {
                        const next = prev + 1;
                        return next < videoCandidates.length ? next : prev;
                      });
                    }}
                  />
                ) : posterSrc ? (
                  <img
                    src={posterSrc}
                    alt="Превью проекта"
                    width={1280}
                    height={720}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="flex h-full w-full min-h-[180px] items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50 text-neutral-400">
                    <span className="text-sm">Видео</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-marquee flex-shrink-0 border-t border-border border-b bg-card overflow-hidden h-12 min-h-[44px] flex items-center">
        <div className="hero-marquee-track flex w-max animate-hero-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((name, i) => (
            <div
              key={i}
              className="hero-marquee-item flex items-center gap-2 px-6 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground whitespace-nowrap border-r border-border last:border-r-0"
            >
              <span className="opacity-40" aria-hidden>◆</span>
              {name}
            </div>
          ))}
        </div>
      </div>
      </div>

      <ProjectTypeModal
        open={isProjectTypeOpen}
        onOpenChange={setIsProjectTypeOpen}
        onSelect={() => scrollToSection(scrollTargetId)}
      />
    </>
  );
}
