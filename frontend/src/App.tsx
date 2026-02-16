import { lazy, Suspense, useState, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { BottomNav } from "@/components/layout/BottomNav";
import { MainNav } from "@/components/layout/MainNav";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { CookieConsent } from "@/components/common/CookieConsent";
import { PageLoader } from "@/components/common/PageLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { usePreloadRoutes } from "@/hooks/usePreloadRoutes";
import { usePublicBootstrap } from "@/hooks/usePublicBootstrap";
import { useWebVitals } from "@/hooks/useWebVitals";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";
import Index from "./pages/Index";

// Ключевые страницы (Услуги, Кейсы, О нас, Контакты, Процесс) — без lazy, открываются с первого раза
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Process from "./pages/Process";

// Остальные — lazy для экономии первого запроса
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Offer = lazy(() => import("./pages/Offer"));
const Consent = lazy(() => import("./pages/Consent"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Cases = lazy(() => import("./pages/Cases"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminCasesList = lazy(() => import("./pages/admin/AdminCasesList"));
const AdminCaseEdit = lazy(() => import("./pages/admin/AdminCaseEdit"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/blog/BlogArticle"));

// Product pages (all products)
const Website = lazy(() => import("./pages/products/Website"));
const TelegramBot = lazy(() => import("./pages/products/TelegramBot"));
const AIVideo = lazy(() => import("./pages/products/AIVideo"));
const AIAgent = lazy(() => import("./pages/products/AIAgent"));
const MiniApp = lazy(() => import("./pages/products/MiniApp"));
const Automation = lazy(() => import("./pages/products/Automation"));
const Ecosystem = lazy(() => import("./pages/products/Ecosystem"));
const Branding = lazy(() => import("./pages/products/Branding"));
const CRM = lazy(() => import("./pages/products/CRM"));
const MobileApp = lazy(() => import("./pages/products/MobileApp"));
const Support = lazy(() => import("./pages/products/Support"));
const Consulting = lazy(() => import("./pages/products/Consulting"));

// Configure Query Client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const DEFAULT_NAV_ITEMS = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/services" },
  { label: "Кейсы", href: "/work" },
  { label: "Процесс", href: "/process" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contact" },
];

// App Routes component with preload hook and web vitals
function AppRoutes() {
  usePreloadRoutes();
  useWebVitals();
  useScrollAnimations(); // Initialize scroll-triggered animations

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/services" element={<Services />} />
      <Route path="/products" element={<Navigate to="/services" replace />} />
      <Route path="/work" element={<Work />} />
      <Route path="/work/:slug" element={<WorkDetail />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/process" element={<Process />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/offer" element={<Offer />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/docs" element={<Admin />} />
      <Route path="/documentation" element={<Admin />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogArticle />} />
      
      {/* Product pages - all products */}
      <Route path="/products/website" element={<Website />} />
      <Route path="/products/telegram-bot" element={<TelegramBot />} />
      <Route path="/products/ai-video" element={<AIVideo />} />
      <Route path="/products/ai-agent" element={<AIAgent />} />
      <Route path="/products/mini-app" element={<MiniApp />} />
      <Route path="/products/automation" element={<Automation />} />
      <Route path="/products/ecosystem" element={<Ecosystem />} />
      <Route path="/products/branding" element={<Branding />} />
      <Route path="/products/crm" element={<CRM />} />
      <Route path="/products/mobile-app" element={<MobileApp />} />
      <Route path="/products/support" element={<Support />} />
      <Route path="/products/consulting" element={<Consulting />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: bootstrap } = usePublicBootstrap();

  const navItems = useMemo(() => {
    const menu = bootstrap?.menus?.mobile ?? bootstrap?.menus?.header;
    const items = menu?.items;
    if (items && Array.isArray(items) && items.length > 0) {
      return (items as Array<{ label: string; url?: string }>)
        .filter((i) => !i.url?.startsWith("#"))
        .map((i) => ({ label: i.label, href: i.url ?? "/" }));
    }
    return DEFAULT_NAV_ITEMS;
  }, [bootstrap]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <ScrollToTop />
      <MainNav />
      <ErrorBoundary>
        <PageTransition>
          <Suspense fallback={<PageSkeleton />}>
            <AppRoutes />
          </Suspense>
        </PageTransition>
      </ErrorBoundary>
      <BottomNav onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
      <CookieConsent />
    </>
  );
}

const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader on very first visit (session storage resets on tab close)
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('neeklo_loaded');
      if (hasLoaded) return false;
      sessionStorage.setItem('neeklo_loaded', 'true');
      return true;
    }
    return false;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showLoader && <PageLoader minDisplayTime={400} />}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
