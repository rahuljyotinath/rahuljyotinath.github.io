import { useEffect } from 'react';

export default function usePageTitle(title, baseTitle = '91SkylineWorks') {
  useEffect(() => {
    document.title = title ? `${title} — ${baseTitle}` : baseTitle;
  }, [title, baseTitle]);
}
