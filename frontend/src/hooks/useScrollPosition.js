import { useEffect, useMemo, useState } from "react";

export default function useScrollPosition({
  sectionIds = [],
  offset = 96,
  scrolledThreshold = 8,
} = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const validSectionIds = useMemo(
    () => sectionIds.filter((id) => typeof id === "string" && id.length > 0),
    [sectionIds]
  );

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (validSectionIds.length === 0) return;

    const elements = validSectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        // Compensates sticky header height.
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0.15, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [offset, validSectionIds]);

  return {
    scrollY,
    isScrolled: scrollY > scrolledThreshold,
    activeSection,
  };
}
