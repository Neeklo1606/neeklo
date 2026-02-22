import { memo, useState } from "react";
import { Link } from "react-router-dom";

export interface CaseCardProps {
  image: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  priority?: boolean;
  className?: string;
}

export const CaseCard = memo(function CaseCard({
  image,
  title,
  description,
  slug,
  category,
  priority = false,
  className = "",
}: CaseCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/portfolio/${slug}`}
      className={`group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-lg ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {!imageError && image ? (
          <img
            src={image}
            alt={title}
            width={960}
            height={600}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            className="h-full w-full object-cover transition-transform duration-300 md:group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
            <span className="text-3xl font-semibold text-muted-foreground/50">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="mb-3 inline-block rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {category}
        </span>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
});
