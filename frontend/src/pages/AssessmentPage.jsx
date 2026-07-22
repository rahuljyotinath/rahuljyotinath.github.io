import { useOutletContext } from 'react-router-dom';
import DiagnosticQuiz from '../components/DiagnosticQuiz';
import usePageTitle from '../hooks/usePageTitle';

export default function AssessmentPage() {
  const { content } = useOutletContext();
  usePageTitle('Self-Diagnostic Assessment');

  return <DiagnosticQuiz contact={content.contact} />;
}
