import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Index = lazy(() => import("@/pages/Index"));
const Services = lazy(() => import("@/pages/Services"));
const Work = lazy(() => import("@/pages/Work"));
const WorkDetail = lazy(() => import("@/pages/WorkDetail"));
const WorkBySlug = lazy(() => import("@/pages/WorkBySlug"));
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
const AdminCaseStudiesList = lazy(() => import("@/pages/admin/AdminCaseStudiesList"));
const AdminCaseStudyEdit = lazy(() => import("@/pages/admin/AdminCaseStudyEdit"));

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
        <Route path="/cases/:slug" element={<WorkBySlug />} />
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

        {/* Admin cases (old CaseModel) */}
        <Route path="/admin/cases" element={<AdminCasesList />} />
        <Route path="/admin/cases/:id" element={<AdminCaseEdit />} />
        {/* Admin case-studies (CMS) */}
        <Route path="/admin/case-studies" element={<AdminCaseStudiesList />} />
        <Route path="/admin/case-studies/:id" element={<AdminCaseStudyEdit />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
