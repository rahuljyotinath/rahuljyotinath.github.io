import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LocalizedNavigate from './components/LocalizedNavigate';
import { ASSAMESE_ENABLED, stripLocalePrefix } from './lib/i18n';

const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EarthquakesPage = lazy(() => import('./pages/EarthquakesPage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesIndexPage = lazy(() => import('./pages/ServicesIndexPage'));
const ServiceCategoryPage = lazy(() => import('./pages/ServiceCategoryPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ProblemsIndexPage = lazy(() => import('./pages/ProblemsIndexPage'));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const KnowledgeIndexPage = lazy(() => import('./pages/KnowledgeIndexPage'));
const KnowledgeArticlePage = lazy(() => import('./pages/KnowledgeArticlePage'));
const GuwahatiLandingPage = lazy(() => import('./pages/GuwahatiLandingPage'));

function PageFallback() {
  return <div className="loading-screen">[ LOADING... ]</div>;
}

function AssameseRedirect() {
  const location = useLocation();
  const target = stripLocalePrefix(location.pathname) + location.search + location.hash;
  return <Navigate to={target} replace />;
}

function siteRouteElements() {
  return [
    <Route key="home" index element={<HomePage />} />,
    <Route key="problems" path="problems" element={<ProblemsIndexPage />} />,
    <Route key="problem" path="problems/:slug" element={<ProblemPage />} />,
    <Route key="industries" path="industries/*" element={<LocalizedNavigate to="/services" replace />} />,
    <Route key="knowledge" path="knowledge" element={<KnowledgeIndexPage />} />,
    <Route key="article" path="knowledge/:slug" element={<KnowledgeArticlePage />} />,
    <Route key="guwahati" path="guwahati/:slug" element={<GuwahatiLandingPage />} />,
    <Route key="services" path="services" element={<ServicesIndexPage />} />,
    <Route key="service-category" path="services/category/:categorySlug" element={<ServiceCategoryPage />} />,
    <Route key="industrial-flooring" path="services/industrial-flooring" element={<LocalizedNavigate to="/services" replace />} />,
    <Route key="facade-restoration" path="services/facade-restoration" element={<LocalizedNavigate to="/services" replace />} />,
    <Route key="service" path="services/:slug" element={<ServicePage />} />,
    <Route key="capabilities" path="capabilities" element={<LocalizedNavigate to="/services" replace />} />,
    <Route key="portfolio" path="portfolio" element={<PortfolioPage />} />,
    <Route key="project" path="portfolio/:slug" element={<ProjectDetailPage />} />,
    <Route key="projects" path="projects" element={<LocalizedNavigate to="/portfolio" replace />} />,
    <Route key="process" path="process" element={<LocalizedNavigate to="/#process" replace />} />,
    <Route key="about" path="about" element={<AboutPage />} />,
    <Route key="clients" path="clients" element={<LocalizedNavigate to="/portfolio#clients" replace />} />,
    <Route key="backing" path="backing" element={<LocalizedNavigate to="/about#backing" replace />} />,
    <Route key="telemetry" path="telemetry" element={<LocalizedNavigate to="/earthquakes#telemetry" replace />} />,
    <Route key="earthquakes" path="earthquakes" element={<EarthquakesPage />} />,
    <Route key="hydrostatic" path="hydrostatic" element={<LocalizedNavigate to="/knowledge" replace />} />,
    <Route key="education" path="education" element={<EducationPage />} />,
    <Route key="analyzer" path="analyzer" element={<AnalyzerPage />} />,
    <Route key="assessment" path="assessment" element={<AssessmentPage />} />,
    <Route key="contact" path="contact" element={<ContactPage />} />,
  ];
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {!ASSAMESE_ENABLED && (
          <>
            <Route path="/as" element={<AssameseRedirect />} />
            <Route path="/as/*" element={<AssameseRedirect />} />
          </>
        )}
        {ASSAMESE_ENABLED && (
          <Route path="/as" element={<AppLayout locale="as" />}>
            {siteRouteElements()}
          </Route>
        )}
        <Route element={<AppLayout locale="en" />}>
          {siteRouteElements()}
        </Route>
      </Routes>
    </Suspense>
  );
}
