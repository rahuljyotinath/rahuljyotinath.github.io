import { useOutletContext } from 'react-router-dom';
import ProjectsShowcase from '../components/ProjectsShowcase';
import ClientsGrid from '../components/ClientsGrid';
import PartnerBadges from '../components/PartnerBadges';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';

export default function PortfolioPage() {
  const { content } = useOutletContext();
  usePageTitle('Portfolio');

  const caseStudies = (content.projects || [])
    .filter((p) => p.caseStudy)
    .concat((content.projects || []).filter((p) => !p.caseStudy));

  return (
    <>
      {content.portfolioIntro && (
        <section className="hub-page portfolio-intro">
          <div className="wrap">
            <SectionHead
              eyebrow={content.portfolioIntro.eyebrow}
              headline={content.portfolioIntro.headline}
              sub={content.portfolioIntro.sub}
            />
          </div>
        </section>
      )}
      <ProjectsShowcase
        projects={caseStudies}
        heading={content.homeSections?.work}
      />
      <PartnerBadges credentials={content.partnerCredentials} />
      <ClientsGrid clients={content.clients} heading={content.homeSections?.clients} />
    </>
  );
}
