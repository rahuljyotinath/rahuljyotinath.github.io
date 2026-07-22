import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'skyline_user_location';
const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000,
};

function readCache() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 2) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function writeCache(coords) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
  } catch {
    // ignore
  }
}

export default function useUserLocation() {
  const cached = readCache();
  const [coords, setCoords] = useState(cached);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [denied, setDenied] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const request = useCallback(() => {
    if (!navigator?.geolocation) {
      setLoading(false);
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    setError(null);
    setDenied(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted.current) return;
        const next = [pos.coords.latitude, pos.coords.longitude];
        setCoords(next);
        writeCache(next);
        setLoading(false);
        setDenied(false);
      },
      (err) => {
        if (!mounted.current) return;
        setLoading(false);
        if (err.code === 1) {
          setDenied(true);
          setError('Location permission denied');
        } else if (err.code === 3) {
          setError('Location request timed out');
        } else {
          setError('Unable to get location');
        }
      },
      DEFAULT_OPTIONS,
    );
  }, []);

  const refresh = useCallback(() => {
    request();
  }, [request]);

  return { coords, loading, error, denied, refresh };
}
