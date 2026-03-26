import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Index = lazy(() => import("@/pages/Index"));
const Services = lazy(() => import("@/pages/Services"));
const Work = lazy(() => import("@/pages/Work"));
const WorkDetail = lazy(() => import("@/pages/WorkDetail"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Process = lazy(() => import("@/pages/Process"));
const Cases = lazy(() => import("@/pages/Cases"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogArticle = lazy(() => import("@/pages/blog/BlogArticle"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Offer = lazy(() => import("@/pages/Offer"));
const Consent = lazy(() => import("@/pages/Consent"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Admin = lazy(() => import("@/pages/Admin"));
const AdminCasesList = lazy(() => import("@/pages/admin/AdminCasesList"));
const AdminCaseEdit = lazy(() => import("@/pages/admin/AdminCaseEdit"));

function Fallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
      Загрузка...
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/process" element={<Process />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/consent" element={<Consent />} />

        {/* Legacy aliases */}
        <Route path="/portfolio" element={<Navigate to="/work" replace />} />
        <Route path="/contacts" element={<Navigate to="/contact" replace />} />
        <Route path="/documentation" element={<Admin />} />
        <Route path="/docs" element={<Admin />} />

        {/* Admin cases inside React app */}
        <Route path="/admin/cases" element={<AdminCasesList />} />
        <Route path="/admin/cases/:id" element={<AdminCaseEdit />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
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
