import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SECTION_IDS = ['hero', 'products', 'faq', 'cases', 'services', 'process', 'contact', 'selector'];

export const useActiveSection = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sectionVisibility = new Map<string, number>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        if (sectionId) sectionVisibility.set(sectionId, entry.intersectionRatio);
      });

      let maxRatio = 0;
      let mostVisibleSection: string | null = null;
      sectionVisibility.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = id;
        }
      });

      if (mostVisibleSection && maxRatio > 0.15) {
        setActiveSection(mostVisibleSection);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '-8% 0px -50% 0px',
    });

    const t = setTimeout(() => {
      SECTION_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [location.pathname]);

  return activeSection;
};

// Map section IDs to nav items
export const sectionToNavMap: Record<string, string> = {
  'hero': '/',
  'products': '/products',
  'cases': '/cases',
  'services': '/services',
  'process': '/process',
  'contact': '/contact',
};
