import { ProjectTypeModal } from "./ProjectTypeModal";
import { useEffect, useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { smoothScrollToId } from "@/lib/smoothScroll";

const MARQUEE_ITEMS = ["NKO", "NEWFRONT", "ROUTABLE", "DANONE", "TECHSTART", "GROWTHCO", "DELIVERECT"];

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
  ctaSecondary,
  scrollTargetId = "contact",
  videoSrc,
  posterSrc,
}: HeroMinimalProps) {
  const [isProjectTypeOpen, setIsProjectTypeOpen] = useState(false);
  const videoCandidates = useMemo(
    () =>
      [
        videoSrc,
        "/frontend/videos/hf_20260220_225651_b8007db0-eebd-4e50-888b-24e3bf441702.mp4",
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

  const scrollToSection = (id: string) => {
    smoothScrollToId(id);
  };

  const lines = title.split("\n").filter(Boolean);
  const lastIsMuted = lines[lines.length - 1]?.startsWith("(") ?? false;
  const mainLines = lastIsMuted ? lines.slice(0, -1) : lines;
  const mutedLine = lastIsMuted ? lines[lines.length - 1] : null;

  return (
    <>
      <section
        ref={heroRef}
        id="hero"
        className={`hero-minimal io-animate io-fade-up relative overflow-x-hidden text-[#0F172A] min-h-[100vh] flex flex-col isolate ${heroVisible ? "io-visible" : ""}`}
      >
        {/* Background grid — behind content, no overlap */}
        <div
          className="hero-minimal__grid absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #0F172A 1px, transparent 1px),
                             linear-gradient(to bottom, #0F172A 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div className="hero-minimal__inner relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 min-h-0">
          <div className="hero-minimal__left max-w-[640px] w-full flex flex-col justify-center items-start text-left">
            <div className="hero-stagger-1 hero-eyebrow hero-badge inline-flex items-center gap-1.5 rounded-full border text-[14px] font-medium uppercase tracking-wider text-[#0F172A]">
              <span className="hero-badge-dot h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              {eyebrow}
            </div>
            <h1 className="hero-stagger-2 hero-title font-heading font-bold text-[#0F172A] tracking-tight mt-0 mb-0">
              {mainLines.map((line, i) => (
                <span key={i} className="hero-title-line">
                  {line}
                </span>
              ))}
              {mutedLine && (
                <span className="hero-title-muted font-medium text-[#94A3B8]">{mutedLine}</span>
              )}
            </h1>
            <p className="hero-stagger-3 hero-subtitle text-[#4A4A4A] text-[18px] leading-[1.6] max-w-[460px]">
              {subtitle}
            </p>
            <div className="hero-stagger-4 hero-ctas flex flex-wrap gap-3 sm:flex-shrink-0" role="group" aria-label="Действия">
              <button
                type="button"
                onClick={() => setIsProjectTypeOpen(true)}
                className="hero-cta-primary inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-[18px] text-white transition-all duration-200 hover:-translate-y-0.5 min-h-[48px]"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  boxShadow: "0 6px 20px rgba(59, 130, 246, 0.26)",
                }}
              >
                {ctaPrimary}
                <span aria-hidden>→</span>
              </button>
              {ctaSecondary ? (
                <button
                  type="button"
                  onClick={() => scrollToSection(scrollTargetId)}
                  className="hero-cta-secondary inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-[16px] text-[#0F172A] border border-[#D6DEEA] bg-white/85 backdrop-blur-sm transition-all duration-200 hover:bg-white min-h-[48px]"
                >
                  {ctaSecondary}
                </button>
              ) : null}
            </div>
          </div>
          <div className="hero-right hero-video-wrap flex justify-end relative">
            <div className="hero-video-glow" aria-hidden />
            <div className="hero-video-container aspect-video w-full max-w-full min-h-[180px] sm:min-h-[220px] overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              {resolvedVideoSrc ? (
                <video
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
      </section>

      <div className="hero-marquee border-t border-[#E8EDF3] border-b bg-white overflow-hidden">
        <div className="hero-marquee-track flex w-max animate-hero-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((name, i) => (
            <div
              key={i}
              className="hero-marquee-item flex items-center gap-2 px-8 py-3.5 text-[11.5px] font-semibold uppercase tracking-widest text-[#94A3B8] whitespace-nowrap border-r border-[#E8EDF3] last:border-r-0"
            >
              <span className="opacity-40" aria-hidden>◆</span>
              {name}
            </div>
          ))}
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
