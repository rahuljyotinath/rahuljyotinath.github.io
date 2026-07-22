import { useOutletContext } from 'react-router-dom';
import ProjectsShowcase from '../components/ProjectsShowcase';
import ClientsGrid from '../components/ClientsGrid';
import usePageTitle from '../hooks/usePageTitle';

export default function PortfolioPage() {
  const { content } = useOutletContext();
  usePageTitle('Portfolio');

  return (
    <>
      <ProjectsShowcase
        projects={content.projects}
        heading={content.homeSections?.work}
      />
      <ClientsGrid clients={content.clients} heading={content.homeSections?.clients} />
    </>
  );
}
