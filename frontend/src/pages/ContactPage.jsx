import { useOutletContext } from 'react-router-dom';
import ContactArray from '../components/ContactArray';
import DiagnosisPackSection from '../components/DiagnosisPackSection';
import InspectionRequestForm from '../components/InspectionRequestForm';
import SectionHead from '../components/SectionHead';
import usePageTitle from '../hooks/usePageTitle';

export default function ContactPage() {
  const { content } = useOutletContext();
  usePageTitle('Contact');

  return (
    <>
      <section className="inspection-form-section">
        <div className="wrap">
          <SectionHead
            eyebrow="Free inspection"
            headline="Book a site visit in Guwahati"
            sub={content.inspectionSla?.visit || "Name, phone, locality, and a brief description — we'll call to confirm."}
          />
          <InspectionRequestForm id="inspection-form" />
          <DiagnosisPackSection pack={content.diagnosisPack} sla={content.inspectionSla} compact />
        </div>
      </section>
      <ContactArray
        contact={content.contact}
        serviceCategories={content.serviceCategories}
        navServices={content.navServices}
      />
    </>
  );
}
