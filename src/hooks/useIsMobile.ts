import { useCallback, useSyncExternalStore } from "react";

const DEFAULT_BREAKPOINT = 768;

/**
 * `useSyncExternalStore` renvoie la valeur serveur (false) pendant l'hydratation puis
 * re-rend avec la vraie valeur : pas de mismatch SSR/client sur mobile.
 */
export function useIsMobile(breakpoint: number = DEFAULT_BREAKPOINT): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
