"use client";

import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { useMetaTags } from "@/hooks/useMetaTags";
import { scrollToElement } from "@/lib/utils";
import { ProductHeroCompact } from "./ProductHeroCompact";
import { ProductExamples } from "./ProductExamples";
import { ProductPackagesCompact } from "./ProductPackagesCompact";
import { HowToOrder } from "./HowToOrder";
import { StickyCTA } from "./StickyCTA";
import { ProductFAQ } from "./ProductFAQ";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { PageWrapper } from "@/components/common/PageWrapper";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductData {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  timeline: string;
  telegramLink: string;
  features: string[];
  packages: Package[];
  faq?: FAQItem[];
  caseCategory?: string; // For filtering examples
}

interface ProductPageCompactTemplateProps {
  data: ProductData;
}

export function ProductPageCompactTemplate({
  data,
}: ProductPageCompactTemplateProps) {
  // SEO
  useMetaTags(
    `${data.title} — Neeklo Studio`,
    data.subtitle,
    undefined,
    `https://neeklo.studio/products/${data.slug}`
  );

  // Get price from first package
  const priceFrom = data.packages[0]?.price || "от 35 000 ₽";

  // Determine case category based on slug
  const getCaseCategory = (): string => {
    if (data.caseCategory) return data.caseCategory;
    
    const slug = data.slug.toLowerCase();
    if (slug.includes("website") || slug.includes("web")) return "Web";
    if (slug.includes("video") || slug.includes("ai-video")) return "AI-Video";
    if (slug.includes("bot") || slug.includes("telegram")) return "Bot";
    if (slug.includes("mini-app") || slug.includes("miniapp")) return "App";
    if (slug.includes("branding")) return "Design";
    if (slug.includes("automation")) return "Automation";
    return "Web"; // Default fallback
  };

  const handleScrollToPackages = () => {
    scrollToElement("packages", 100, "smooth");
  };

  return (
    <PageWrapper>
      <main className="pb-24 lg:pb-0">
        {/* Hero - Compact */}
        <ProductHeroCompact
          badge={data.badge}
          title={data.title}
          subtitle={data.subtitle}
          priceFrom={priceFrom}
          duration={data.timeline}
          chips={data.features || []}
          telegramLink={data.telegramLink}
          onScrollToPackages={handleScrollToPackages}
        />

        {/* Examples/Cases */}
        <Suspense fallback={<PageSkeleton variant="minimal" />}>
          <ProductExamples category={getCaseCategory()} maxItems={6} />
        </Suspense>

        {/* Packages */}
        <ProductPackagesCompact
          packages={data.packages}
          telegramLink={data.telegramLink}
          productTitle={data.title}
        />

        {/* How to Order */}
        <HowToOrder
          telegramLink={data.telegramLink}
          productTitle={data.title}
        />

        {/* FAQ - Optional, only if has items */}
        {data.faq && data.faq.length > 0 && (
          <ProductFAQ items={data.faq.slice(0, 3)} />
        )}

        {/* Sticky CTA - Mobile only */}
        <StickyCTA
          priceFrom={priceFrom}
          telegramLink={data.telegramLink}
          productTitle={data.title}
        />
      </main>

      <Footer />
    </PageWrapper>
  );
}
