import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';

const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EarthquakesPage = lazy(() => import('./pages/EarthquakesPage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesIndexPage = lazy(() => import('./pages/ServicesIndexPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ProblemsIndexPage = lazy(() => import('./pages/ProblemsIndexPage'));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const KnowledgeIndexPage = lazy(() => import('./pages/KnowledgeIndexPage'));
const KnowledgeArticlePage = lazy(() => import('./pages/KnowledgeArticlePage'));

function PageFallback() {
  return <div className="loading-screen">[ LOADING... ]</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="problems" element={<ProblemsIndexPage />} />
          <Route path="problems/:slug" element={<ProblemPage />} />
          <Route path="industries/*" element={<Navigate to="/services" replace />} />
          <Route path="knowledge" element={<KnowledgeIndexPage />} />
          <Route path="knowledge/:slug" element={<KnowledgeArticlePage />} />
          <Route path="services" element={<ServicesIndexPage />} />
          <Route path="services/industrial-flooring" element={<Navigate to="/services" replace />} />
          <Route path="services/facade-restoration" element={<Navigate to="/services" replace />} />
          <Route path="services/:slug" element={<ServicePage />} />
          <Route path="capabilities" element={<Navigate to="/services" replace />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="projects" element={<Navigate to="/portfolio" replace />} />
          <Route path="process" element={<Navigate to="/#process" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="clients" element={<Navigate to="/portfolio#clients" replace />} />
          <Route path="backing" element={<Navigate to="/about#backing" replace />} />
          <Route path="telemetry" element={<Navigate to="/earthquakes#telemetry" replace />} />
          <Route path="earthquakes" element={<EarthquakesPage />} />
          <Route path="hydrostatic" element={<Navigate to="/knowledge" replace />} />
          <Route path="education" element={<Navigate to="/knowledge" replace />} />
          <Route path="analyzer" element={<AnalyzerPage />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
