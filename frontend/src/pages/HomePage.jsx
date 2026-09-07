import { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import LocalizedLink from '../components/LocalizedLink';
import HeroLanding from '../components/HeroLanding';
import StatsBar from '../components/StatsBar';
import ProblemGrid from '../components/ProblemGrid';
import DoctorPositioning from '../components/DoctorPositioning';
import InspectionRequestForm from '../components/InspectionRequestForm';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';

const GoogleReviews = lazy(() => import('../components/GoogleReviews'));
const EarthquakeHomeSection = lazy(() => import('../components/EarthquakeHomeSection'));
const ServicesGrid = lazy(() => import('../components/ServicesGrid'));
const ProjectsShowcase = lazy(() => import('../components/ProjectsShowcase'));
const ProcessGrid = lazy(() => import('../components/ProcessGrid'));
const AboutSection = lazy(() => import('../components/AboutSection'));
const ClientsGrid = lazy(() => import('../components/ClientsGrid'));
const BackingSection = lazy(() => import('../components/BackingSection'));
const HomeownerFaq = lazy(() => import('../components/HomeownerFaq'));
const GuidesTeaser = lazy(() => import('../components/GuidesTeaser'));
const ContactTeaser = lazy(() => import('../components/ContactTeaser'));
const InspectionCTA = lazy(() => import('../components/InspectionCTA'));
const PagePreview = lazy(() => import('../components/PagePreview'));

function HomeSectionFallback() {
  return null;
}

export default function HomePage() {
  const { content } = useOutletContext();
  const hs = content.homeSections || {};

  usePageTitle('Building Doctor — Guwahati');

  return (
    <>
      <HeroLanding hero={content.hero} company={content.company} />
      <StatsBar stats={content.stats} />
      {hs.problemGrid && (
        <ProblemGrid
          grid={content.homeProblemGrid}
          categories={content.problemCategories}
          problems={content.problems}
          limit={6}
        />
      )}
      {hs.doctorPositioning && <DoctorPositioning data={content.doctorPositioning} showCta={false} />}
      <section className="local-seo-links">
        <div className="wrap">
          <p className="local-seo-links-label">Popular in Guwahati</p>
          <ul>
            <li>
              <LocalizedLink to="/guwahati/waterproofing">Waterproofing in Guwahati</LocalizedLink>
            </li>
            <li>
              <LocalizedLink to="/guwahati/building-crack-repair">Building crack repair in Guwahati</LocalizedLink>
            </li>
            <li>
              <LocalizedLink to="/services/retrofitting">Building retrofitting in Guwahati</LocalizedLink>
            </li>
          </ul>
        </div>
      </section>
      <section className="inspection-form-section">
        <div className="wrap">
          <SectionHead
            eyebrow="Free inspection"
            headline="Book a site visit in Guwahati"
            sub="Name, phone, locality, and a brief description — we'll call to confirm."
          />
          <InspectionRequestForm id="inspection-form" />
        </div>
      </section>
      <Suspense fallback={<HomeSectionFallback />}>
        {hs.inspectionCta && <InspectionCTA data={hs.inspectionCta} showPrimary={false} />}
        <GoogleReviews heading={hs.googleReviews} data={content.googleReviewsData} />
        <section>
          <div className="wrap">
            {hs.earthquakes && (
              <SectionHead eyebrow={hs.earthquakes.eyebrow} headline={hs.earthquakes.headline} />
            )}
            <EarthquakeHomeSection copy={content.earthquakes} limit={5} />
          </div>
        </section>
        <PagePreview heading={hs.capabilities} to="/services" linkLabel="View all services">
          <ServicesGrid services={content.services} bare />
        </PagePreview>
        <PagePreview heading={hs.work} to="/portfolio" linkLabel="View all projects" id="work" className="section-work">
          <ProjectsShowcase projects={content.projects} limit={3} bare />
        </PagePreview>
        <div className="hazard" />
        <ProcessGrid process={content.process} heading={hs.process} />
        <PagePreview heading={hs.team} to="/about" linkLabel="Meet the team">
          <AboutSection about={content.about} company={content.company} excerpt bare />
        </PagePreview>
        <PagePreview heading={hs.clients} to="/portfolio#clients" linkLabel="View all clients">
          <ClientsGrid clients={content.clients} limit={4} bare />
        </PagePreview>
        <PagePreview heading={hs.backing} to="/about#backing" linkLabel="Learn more">
          <BackingSection backing={content.backing} limit={3} bare />
        </PagePreview>
        <HomeownerFaq data={content.homeownerFaq} />
        <GuidesTeaser articles={content.knowledgeArticles} heading={hs.guides} />
        <ContactTeaser
          contact={content.contact}
          heading={hs.contact}
          teaser={content.contactTeaser}
        />
      </Suspense>
    </>
  );
}
