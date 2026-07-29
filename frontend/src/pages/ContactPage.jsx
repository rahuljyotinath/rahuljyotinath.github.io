import { useOutletContext } from 'react-router-dom';
import ContactArray from '../components/ContactArray';
import usePageTitle from '../hooks/usePageTitle';

export default function ContactPage() {
  const { content } = useOutletContext();
  usePageTitle('Contact');

  return (
    <ContactArray
      contact={content.contact}
      serviceCategories={content.serviceCategories}
      navServices={content.navServices}
    />
  );
}
