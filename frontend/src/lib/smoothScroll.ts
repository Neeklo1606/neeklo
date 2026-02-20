interface SmoothScrollOptions {
  behavior?: ScrollBehavior;
  updateHash?: boolean;
}

function readCssOffset(): number | null {
  if (typeof window === "undefined") return null;
  const value = getComputedStyle(document.documentElement).getPropertyValue("--scroll-offset").trim();
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function getFixedHeaderOffset(): number {
  if (typeof window === "undefined") return 0;
  const cssOffset = readCssOffset();
  if (cssOffset != null) return cssOffset;

  const nav = document.querySelector<HTMLElement>("header[role='navigation']");
  if (!nav) return 0;
  const navRect = nav.getBoundingClientRect();
  return Math.max(0, Math.round(navRect.height + navRect.top));
}

export function smoothScrollToId(id: string, options: SmoothScrollOptions = {}) {
  if (typeof window === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;

  const { behavior = "smooth", updateHash = true } = options;
  const offset = getFixedHeaderOffset();
  const y = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, y),
    behavior,
  });

  if (updateHash) {
    window.history.replaceState(null, "", `#${id}`);
  }
}
