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
  const { data: page, isLoading, isError } = usePublicPage(slug);
  const { data: bootstrap } = usePublicBootstrap();

  useEffect(() => {
    if (isError) navigate("/404", { replace: true });
  }, [isError, navigate]);

  useEffect(() => {
    if (page) {
      const defaults = getSeoDefaults(bootstrap);
      setMetaTags(page, defaults);
    }
  }, [page, bootstrap]);

  if (isLoading || !page) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24 lg:pb-0 pt-0">
        <BlockRenderer blocks={page.blocks} />
      </main>
      {showStickyCta && <StickyCtaButton />}
      <Footer />
    </div>
  );
}
