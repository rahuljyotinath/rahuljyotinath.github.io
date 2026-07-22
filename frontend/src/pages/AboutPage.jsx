import { useOutletContext } from 'react-router-dom';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';
import BackingSection from '../components/BackingSection';
import usePageTitle from '../hooks/usePageTitle';

export default function AboutPage() {
  const { content } = useOutletContext();
  usePageTitle('About');

  return (
    <>
      <AboutSection about={content.about} company={content.company} />
      <TeamSection
        team={content.team}
        heading={{ eyebrow: 'Leadership', headline: 'Expert guidance for homeowners.' }}
      />
      <BackingSection backing={content.backing} heading={content.homeSections?.backing} />
    </>
  );
}
