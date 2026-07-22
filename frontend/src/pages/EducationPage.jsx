import { useOutletContext } from 'react-router-dom';
import ForensicEducationArray from '../components/ForensicEducationArray';
import HomeBuyerAdvisory from '../components/HomeBuyerAdvisory';
import usePageTitle from '../hooks/usePageTitle';

export default function EducationPage() {
  const { content } = useOutletContext();
  usePageTitle('Forensic Engineering Education');

  return (
    <>
      <ForensicEducationArray education={content.education} />
      <div className="hazard" />
      <HomeBuyerAdvisory advisory={content.advisory} />
    </>
  );
}
