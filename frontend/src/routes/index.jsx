import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import MetaTags from "@/components/MetaTags";
import { usePreloadRoutes } from "@/hooks/usePreloadRoutes";
import { useWebVitals } from "@/hooks/useWebVitals";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";
import { smoothScrollToId } from "@/lib/smoothScroll";

const Index = lazy(() => import("@/pages/Index"));
const ServicesList = lazy(() => import("@/pages/Services/ServicesList.jsx"));
const ServiceDetail = lazy(() => import("@/pages/Services/ServiceDetail.jsx"));
const PortfolioList = lazy(() => import("@/pages/Portfolio/PortfolioList.jsx"));
const CaseDetail = lazy(() => import("@/pages/Portfolio/CaseDetail.jsx"));
const PricingPage = lazy(() => import("@/pages/Pricing/PricingPage.jsx"));
const AboutPage = lazy(() => import("@/pages/About/AboutPage.jsx"));
const BlogList = lazy(() => import("@/pages/Blog/BlogList.jsx"));
const BlogDetail = lazy(() => import("@/pages/Blog/BlogDetail.jsx"));
const ContactsPage = lazy(() => import("@/pages/Contacts/ContactsPage.jsx"));
const PrivacyPolicy = lazy(() => import("@/pages/Legal/PrivacyPolicy.jsx"));
const OfferAgreement = lazy(() => import("@/pages/Legal/OfferAgreement.jsx"));
const Error404 = lazy(() => import("@/pages/Error/Error404.jsx"));

const Process = lazy(() => import("@/pages/Process"));
const Cases = lazy(() => import("@/pages/Cases"));
const Consent = lazy(() => import("@/pages/Consent"));
const Terms = lazy(() => import("@/pages/Terms"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminCasesList = lazy(() => import("@/pages/admin/AdminCasesList"));
const AdminCaseEdit = lazy(() => import("@/pages/admin/AdminCaseEdit"));
const WorkDetail = lazy(() => import("@/pages/WorkDetail"));
const Website = lazy(() => import("@/pages/products/Website"));
const TelegramBot = lazy(() => import("@/pages/products/TelegramBot"));
const AIVideo = lazy(() => import("@/pages/products/AIVideo"));
const AIAgent = lazy(() => import("@/pages/products/AIAgent"));
const MiniApp = lazy(() => import("@/pages/products/MiniApp"));
const Automation = lazy(() => import("@/pages/products/Automation"));
const Ecosystem = lazy(() => import("@/pages/products/Ecosystem"));
const Branding = lazy(() => import("@/pages/products/Branding"));
const CRM = lazy(() => import("@/pages/products/CRM"));
const MobileApp = lazy(() => import("@/pages/products/MobileApp"));
const Support = lazy(() => import("@/pages/products/Support"));
const Consulting = lazy(() => import("@/pages/products/Consulting"));

const ROUTES = [
  { path: "/", component: Index, meta: { title: "Neeklo Studio", description: "Digital studio for websites, product design and automation." } },
  { path: "/services", component: ServicesList, meta: { title: "Services", description: "All Neeklo services." } },
  { path: "/services/:slug", component: ServiceDetail, meta: { title: "Service details", description: "Detailed service page." } },
  { path: "/portfolio", component: PortfolioList, meta: { title: "Portfolio", description: "All case studies with filters." } },
  { path: "/portfolio/:slug", component: CaseDetail, meta: { title: "Case study", description: "Detailed case study page." } },
  { path: "/pricing", component: PricingPage, meta: { title: "Pricing", description: "Pricing packages and plans." } },
  { path: "/about", component: AboutPage, meta: { title: "About", description: "About Neeklo and team." } },
  { path: "/blog", component: BlogList, meta: { title: "Blog", description: "Latest articles and insights." } },
  { path: "/blog/:slug", component: BlogDetail, meta: { title: "Blog article", description: "Detailed article page." } },
  { path: "/contacts", component: ContactsPage, meta: { title: "Contacts", description: "Contact form, map and contact information." } },
  { path: "/legal/privacy", component: PrivacyPolicy, meta: { title: "Privacy policy", description: "Privacy policy document." } },
  { path: "/legal/offer", component: OfferAgreement, meta: { title: "Public offer", description: "Offer agreement terms." } },
  { path: "/404", component: Error404, meta: { title: "404", description: "Page not found." } },
  { path: "/products", redirectTo: "/services" },
  { path: "/work", redirectTo: "/portfolio" },
  { path: "/work/:slug", component: CaseDetail, meta: { title: "Case study", description: "Detailed case study page." } },
  { path: "/contact", redirectTo: "/contacts" },
  { path: "/privacy", redirectTo: "/legal/privacy" },
  { path: "/offer", redirectTo: "/legal/offer" },
  { path: "/process", component: Process, meta: { title: "Process", description: "Our work process." } },
  { path: "/cases", component: Cases, meta: { title: "Cases", description: "Case studies landing page." } },
  { path: "/consent", component: Consent, meta: { title: "Consent", description: "Cookie consent details." } },
  { path: "/terms", component: Terms, meta: { title: "Terms", description: "Terms and conditions." } },
  { path: "/docs", component: Admin, meta: { title: "Documentation", description: "Documentation and resources." } },
  { path: "/documentation", component: Admin, meta: { title: "Documentation", description: "Documentation and resources." } },
  { path: "/admin/cases", component: AdminCasesList, meta: { title: "Admin cases", description: "Case studies management." } },
  { path: "/admin/cases/:id", component: AdminCaseEdit, meta: { title: "Edit case", description: "Case study editing page." } },
  { path: "/work-detail", component: WorkDetail, meta: { title: "Work detail", description: "Project detail page." } },
  { path: "/products/website", component: Website, meta: { title: "Website", description: "Website service page." } },
  { path: "/products/telegram-bot", component: TelegramBot, meta: { title: "Telegram Bot", description: "Telegram bot service page." } },
  { path: "/products/ai-video", component: AIVideo, meta: { title: "AI Video", description: "AI video service page." } },
  { path: "/products/ai-agent", component: AIAgent, meta: { title: "AI Agent", description: "AI agent service page." } },
  { path: "/products/mini-app", component: MiniApp, meta: { title: "Mini App", description: "Mini app service page." } },
  { path: "/products/automation", component: Automation, meta: { title: "Automation", description: "Automation service page." } },
  { path: "/products/ecosystem", component: Ecosystem, meta: { title: "Ecosystem", description: "Ecosystem service page." } },
  { path: "/products/branding", component: Branding, meta: { title: "Branding", description: "Branding service page." } },
  { path: "/products/crm", component: CRM, meta: { title: "CRM", description: "CRM service page." } },
  { path: "/products/mobile-app", component: MobileApp, meta: { title: "Mobile App", description: "Mobile app service page." } },
  { path: "/products/support", component: Support, meta: { title: "Support", description: "Support service page." } },
  { path: "/products/consulting", component: Consulting, meta: { title: "Consulting", description: "Consulting service page." } },
];

function ScrollRestorationOnRouteChange() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const run = () => smoothScrollToId(id, { updateHash: false });
      requestAnimationFrame(() => requestAnimationFrame(run));
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

function RouteTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function RouteElement({ component: Component, meta }) {
  return (
    <ErrorBoundary>
      <MetaTags title={meta?.title} description={meta?.description} />
      <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
        <RouteTransition>
          <Component />
        </RouteTransition>
      </Suspense>
    </ErrorBoundary>
  );
}

export function ProtectedRoute({ isAuthenticated = false, redirectTo = "/", children }) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

export default function AppRoutes() {
  usePreloadRoutes();
  useWebVitals();
  useScrollAnimations();
  const location = useLocation();

  return (
    <>
      <ScrollRestorationOnRouteChange />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {ROUTES.map((route) => {
            if (route.redirectTo) {
              return <Route key={route.path} path={route.path} element={<Navigate to={route.redirectTo} replace />} />;
            }
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<RouteElement component={route.component} meta={route.meta} />}
              />
            );
          })}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
