import { Link, useLocation } from 'react-router-dom';
import { alternateLocalePath, getLocaleFromPathname, LOCALE_LABELS } from '../lib/i18n';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const other = locale === 'en' ? 'as' : 'en';

  return (
    <div className="lang-switcher" aria-label="Language">
      <Link
        to={alternateLocalePath(location.pathname + location.search, other)}
        className="lang-switcher-link"
        hrefLang={other}
        lang={other}
      >
        {LOCALE_LABELS[other]}
      </Link>
    </div>
  );
}
