import {useCallback, useEffect, useState} from 'react';

/**
 * Returns whether the current window matches the given media query. Re-runs when the window is
 * resized.
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((query: string): boolean => {
    return window.matchMedia(query).matches;
  }, []);

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query, getMatches]);

  return matches;
}
