import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { HeaderWhatsAppLink } from './WhatsAppCTA';
import '../styles/conversion-cta.css';
import './Header.css';

function InspectionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14h6M9 18h4" />
    </svg>
  );
}

function NavIconTooltip({ tip, children }) {
  return (
    <span className="icon-tooltip" data-tooltip={tip}>
      {children}
    </span>
  );
}

function NavDropdown({ label, items, isOpen, setOpen, dropdownRef, onClose }) {
  if (!items.length) return null;

  return (
    <div ref={dropdownRef} className={`nav-dropdown ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="nav-dropdown-toggle"
        aria-expanded={isOpen}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>
      <div className="nav-dropdown-menu">
        {items.map((item) => (
          <Link key={item.href} to={item.href} onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const toolsRef = useRef(null);
  const moreRef = useRef(null);
  const location = useLocation();

  const primary = content?.nav || [];
  const tools = content?.navTools || [];
  const more = content?.navMore || [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setToolsOpen(false);
    setMoreOpen(false);
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!toolsOpen) return undefined;

    const onPointerDown = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [toolsOpen]);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const onPointerDown = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [moreOpen]);

  if (!content) return null;

  const closeMenu = () => {
    setMenuOpen(false);
    setToolsOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <Link className="brand" to="/" onClick={closeMenu}>
          {content.company?.logo ? (
            <picture>
              <source srcSet={content.company.logo.replace(/\.png$/i, '.webp')} type="image/webp" />
              <img src={content.company.logo} alt={content.company.name} className="brand-logo" width={120} height={40} />
            </picture>
          ) : (
            <>
              <span className="mark" />
              <span>{content.company?.name}</span>
            </>
          )}
        </Link>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {primary.map((item) => (
            <Link key={item.href} to={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <NavDropdown
            label={content.navToolsLabel || 'Tools'}
            items={tools}
            isOpen={toolsOpen}
            setOpen={setToolsOpen}
            dropdownRef={toolsRef}
            onClose={closeMenu}
          />
          <NavDropdown
            label="More"
            items={more}
            isOpen={moreOpen}
            setOpen={setMoreOpen}
            dropdownRef={moreRef}
            onClose={closeMenu}
          />
        </nav>
        <div className="nav-cta-wrap">
          <HeaderWhatsAppLink contact={content.contact} />
          <NavIconTooltip tip="Book a free site inspection">
            <Link
              className="btn-conversion btn-conversion--inspection btn-conversion--icon-only nav-cta-btn"
              to="/contact"
              aria-label="Book a free site inspection"
            >
              <InspectionIcon />
            </Link>
          </NavIconTooltip>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
