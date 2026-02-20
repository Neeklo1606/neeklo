import { usePublicPage } from "@/hooks/usePublicPage";
import { usePublicBootstrap } from "@/hooks/usePublicBootstrap";
import { setMetaTags } from "@/lib/seo";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Footer } from "@/components/layout/Footer";
import { StickyCtaButton } from "@/components/layout/StickyCtaButton";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function getSeoDefaults(bootstrap: { settings?: Record<string, Array<{ key: string; value?: unknown[] }>> } | null | undefined) {
  const seoItems = bootstrap?.settings?.seo ?? [];
  const get = (key: string) => {
    const item = seoItems.find((s) => s.key === key);
    const v = item?.value;
    return Array.isArray(v) && v.length > 0 ? String(v[0]) : "";
  };
  return { default_title: get("default_title"), default_description: get("default_description") };
}

interface CmsPageProps {
  slug: string;
  showStickyCta?: boolean;
}

export function CmsPage({ slug, showStickyCta }: CmsPageProps) {
  const navigate = useNavigate();
  const { data: page, isLoading, isError, error } = usePublicPage(slug);
  const { data: bootstrap } = usePublicBootstrap();

  useEffect(() => {
    if (isError && slug !== "home") navigate("/404", { replace: true });
  }, [isError, slug, navigate]);

  useEffect(() => {
    if (page) {
      const defaults = getSeoDefaults(bootstrap);
      setMetaTags(page, defaults);
    }
  }, [page, bootstrap]);

  if (isLoading && !page) return <PageSkeleton />;

  if (isError && slug === "home") {
    const msg = error?.message ?? "Page not found";
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">
          <h1 className="text-lg font-semibold text-foreground mb-2">Контент главной не найден</h1>
          <p className="text-sm text-muted-foreground mb-4">{msg}</p>
          <p className="text-xs text-muted-foreground">Выполните в корне проекта: <code className="bg-muted px-1 rounded">php artisan db:seed</code></p>
        </div>
      </div>
    );
  }

  if (isError || !page) return null;

  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  const hasServicesTeaser = blocks.some((b: { type?: string }) => b.type === "services_teaser");
  const blocksToRender =
    slug === "home" && !hasServicesTeaser
      ? [
          ...blocks,
          { id: -1, type: "services_teaser", position: 2, is_enabled: true, data: {} },
        ].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      : blocks;

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24 lg:pb-0 pt-0">
        <BlockRenderer blocks={blocksToRender} />
      </main>
      {showStickyCta && <StickyCtaButton />}
      <Footer />
    </div>
  );
}
