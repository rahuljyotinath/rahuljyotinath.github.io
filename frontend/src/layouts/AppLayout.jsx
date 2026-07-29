import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import SiteFooter from '../components/SiteFooter';
import WhatsAppCTA from '../components/WhatsAppCTA';
import FloatingContactFab from '../components/FloatingContactFab';
import ConsentBanner from '../components/ConsentBanner';
import GtmLoader from '../components/GtmLoader';
import useContent from '../hooks/useContent';

export default function AppLayout() {
  const { content, error, loading } = useContent();

  if (loading) {
    return <div className="loading-screen">[ INITIALIZING DIGITAL TERMINAL... ]</div>;
  }

  if (error || !content) {
    return (
      <div className="error-screen">
        <p>Content array offline: {error}</p>
        <p style={{ marginTop: '1rem', color: 'var(--muted)', fontSize: '.85rem' }}>
          Start MariaDB (docker compose up -d) and API (cd backend && npm run dev)
        </p>
      </div>
    );
  }

  return (
    <>
      <GtmLoader />
      <Header content={content} />
      <main>
        <Outlet context={{ content }} />
      </main>
      <SiteFooter content={content} />
      <WhatsAppCTA content={content} />
      <FloatingContactFab contact={content.contact} />
      <ConsentBanner />
    </>
  );
}
