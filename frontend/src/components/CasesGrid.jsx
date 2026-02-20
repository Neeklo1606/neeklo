import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCases } from "@/api/cases";
import { CaseCard } from "@/components/common/CaseCard";

const FALLBACK_TITLE = "Портфолио";

export default function CasesGrid({ title = FALLBACK_TITLE, limit }) {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCases = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCases();
        if (isMounted) setCases(data);
      } catch (err) {
        if (!isMounted) return;
        const message = err?.response?.data?.message || err?.message || "Failed to load cases";
        setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCases();

    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(() => {
    if (!limit || Number.isNaN(Number(limit))) return cases;
    return cases.slice(0, Number(limit));
  }, [cases, limit]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{title}</h2>
        <Link to="/portfolio" className="text-sm md:text-base font-medium text-primary hover:underline">
          View All Cases
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-muted-foreground">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <CaseCard
              key={item.id || item.slug}
              image={item.cover_image || ""}
              title={item.title}
              description={item.short_description || item.category || "Подробнее о проекте"}
              slug={item.slug}
              category={item.category || "Case"}
              priority={index < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
