import { useEffect, useMemo, useState } from "react";
import useScrollPosition from "@/hooks/useScrollPosition";

const DEFAULT_ITEMS = [
  { label: "Home", href: "#hero", sectionId: "hero" },
  { label: "Services", href: "#services", sectionId: "services" },
  { label: "Portfolio", href: "#portfolio", sectionId: "portfolio" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

function scrollToHash(hash, closeMenu) {
  const targetId = hash.replace(/^#/, "");
  const el = document.getElementById(targetId);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${targetId}`);
  if (closeMenu) closeMenu();
}

export default function Navbar({ items = DEFAULT_ITEMS, logo = "Logo" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = useMemo(() => items.map((item) => item.sectionId).filter(Boolean), [items]);
  const { isScrolled, activeSection } = useScrollPosition({
    sectionIds,
    offset: 96,
    scrolledThreshold: 8,
  });

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleItemClick = (event, item) => {
    if (!item.href?.startsWith("#")) return;
    event.preventDefault();
    scrollToHash(item.href, () => setMobileOpen(false));
  };

  const getItemClassName = (item) => {
    const isActive =
      (item.sectionId && item.sectionId === activeSection) ||
      (!activeSection && typeof window !== "undefined" && window.location.hash === item.href);

    return [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70",
    ].join(" ");
  };

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 w-full transition-all duration-200",
          isScrolled
            ? "bg-white/80 backdrop-blur-[10px] border-b border-slate-200/80 shadow-sm"
            : "bg-transparent",
        ].join(" ")}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#hero", () => setMobileOpen(false));
            }}
            className="text-base font-semibold text-slate-900"
          >
            {logo}
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <a
                  href={item.href}
                  onClick={(event) => handleItemClick(event, item)}
                  className={getItemClassName(item)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close mobile menu backdrop"
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <span className="font-semibold text-slate-900">{logo}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Close mobile menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="p-3">
              {items.map((item) => (
                <li key={`mobile-${item.href}-${item.label}`}>
                  <a
                    href={item.href}
                    onClick={(event) => handleItemClick(event, item)}
                    className={`${getItemClassName(item)} block`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
