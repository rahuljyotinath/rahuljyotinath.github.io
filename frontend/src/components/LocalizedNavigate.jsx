import { Navigate, useLocation } from 'react-router-dom';
import { getLocaleFromPathname, localizedPath } from '../lib/i18n';

export default function LocalizedNavigate({ to, ...props }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  return <Navigate to={localizedPath(to, locale)} {...props} />;
}
