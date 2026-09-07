import { useOutletContext } from 'react-router-dom';
import ContactArray from '../components/ContactArray';
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
            sub="Name, phone, locality, and a brief description — we'll call to confirm."
          />
          <InspectionRequestForm id="inspection-form" />
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
