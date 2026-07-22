import { useOutletContext } from 'react-router-dom';
import VisionScanner from '../components/VisionScanner';
import usePageTitle from '../hooks/usePageTitle';

export default function AnalyzerPage() {
  const { content } = useOutletContext();
  usePageTitle('Structural Camera Analyzer');

  return <VisionScanner contact={content.contact} />;
}
