import { useEffect } from 'react';

export default function usePageTitle(title, baseTitle = '91SkylineWorks') {
  useEffect(() => {
    if (!title) {
      document.title = baseTitle || '91SkylineWorks';
      return;
    }
    document.title = baseTitle ? `${title} — ${baseTitle}` : title;
  }, [title, baseTitle]);
}
