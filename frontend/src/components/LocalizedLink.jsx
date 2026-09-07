import { Link, useLocation } from 'react-router-dom';
import { getLocaleFromPathname, localizedPath } from '../lib/i18n';

export default function LocalizedLink({ to, ...props }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  return <Link to={localizedPath(to, locale)} {...props} />;
}
