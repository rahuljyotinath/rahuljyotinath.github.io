import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LocalizedLink from './LocalizedLink';
import LanguageSwitcher from './LanguageSwitcher';
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

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
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

function NavDropdown({ label, labelHref, items, isOpen, setOpen, dropdownRef, onClose }) {
  if (!items.length && !labelHref) return null;

  const toggle = () => setOpen((o) => !o);

  return (
    <div ref={dropdownRef} className={`nav-dropdown ${isOpen ? 'open' : ''}`}>
      {labelHref ? (
        <div className="nav-dropdown-label-row">
          <LocalizedLink to={labelHref} className="nav-dropdown-link" onClick={onClose}>
            {label}
          </LocalizedLink>
          {items.length > 0 && (
            <button
              type="button"
              className="nav-dropdown-chevron"
              aria-expanded={isOpen}
              aria-label={`${label} categories`}
              onClick={toggle}
            >
              <ChevronDownIcon />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="nav-dropdown-toggle"
          aria-expanded={isOpen}
          onClick={toggle}
        >
          {label}
          {items.length > 0 && <ChevronDownIcon />}
        </button>
      )}
      {items.length > 0 && (
        <div className="nav-dropdown-menu">
          {items.map((item) => (
            <LocalizedLink key={item.href} to={item.href} onClick={onClose}>
              {item.label}
            </LocalizedLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ content, locale = 'en' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const toolsRef = useRef(null);
  const servicesRef = useRef(null);
  const moreRef = useRef(null);
  const location = useLocation();

  const primary = content?.nav || [];
  const servicesNav = (content?.navServices || []).filter(
    (item) => item.href !== '/services' && item.label !== 'All services',
  );
  const tools = content?.navTools || [];
  const more = content?.navMore || [];
  const servicesLabel = locale === 'as' ? 'সেৱাসমূহ' : 'Services';
  const moreLabel = locale === 'as' ? 'অধিক' : 'More';
  const menuLabel = locale === 'as' ? 'মেনু' : 'Menu';
  const inspectionTip = locale === 'as' ? 'বিনামূলীয়া ছাইট পৰিদৰ্শন বুক কৰক' : 'Book a free site inspection';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setToolsOpen(false);
    setServicesOpen(false);
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
    if (!servicesOpen) return undefined;

    const onPointerDown = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [servicesOpen]);

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
    setServicesOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <LocalizedLink className="brand" to="/" onClick={closeMenu}>
          {content.company?.logo ? (
            <picture>
              <source srcSet={content.company.logo.replace(/\.png$/i, '.webp')} type="image/webp" />
              <img src={content.company.logo} alt={content.company.name} className="brand-logo" width={141} height={47} />
            </picture>
          ) : (
            <>
              <span className="mark" />
              <span>{content.company?.name}</span>
            </>
          )}
        </LocalizedLink>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {primary.flatMap((item) => {
            const links = [
              <LocalizedLink key={item.href} to={item.href} onClick={closeMenu}>
                {item.label}
              </LocalizedLink>,
            ];
            if (item.href === '/problems' && servicesNav.length > 0) {
              links.push(
                <NavDropdown
                  key="services"
                  label={servicesLabel}
                  labelHref="/services"
                  items={servicesNav}
                  isOpen={servicesOpen}
                  setOpen={setServicesOpen}
                  dropdownRef={servicesRef}
                  onClose={closeMenu}
                />,
              );
            }
            return links;
          })}
          <NavDropdown
            label={content.navToolsLabel || (locale === 'as' ? 'সঁজুলি' : 'Tools')}
            items={tools}
            isOpen={toolsOpen}
            setOpen={setToolsOpen}
            dropdownRef={toolsRef}
            onClose={closeMenu}
          />
          <NavDropdown
            label={moreLabel}
            items={more}
            isOpen={moreOpen}
            setOpen={setMoreOpen}
            dropdownRef={moreRef}
            onClose={closeMenu}
          />
        </nav>
        <div className="nav-cta-wrap">
          <LanguageSwitcher />
          <HeaderWhatsAppLink contact={content.contact} />
          <NavIconTooltip tip={inspectionTip}>
            <LocalizedLink
              className="btn-conversion btn-conversion--inspection btn-conversion--icon-only nav-cta-btn"
              to="/contact#inspection-form"
              aria-label={inspectionTip}
            >
              <InspectionIcon />
            </LocalizedLink>
          </NavIconTooltip>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuLabel}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
