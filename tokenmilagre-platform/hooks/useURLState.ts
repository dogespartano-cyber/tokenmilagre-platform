import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook to sync state with URL search params
 *
 * @param paramName - The URL parameter name
 * @param defaultValue - Default value if param not present
 * @returns [value, setValue] tuple
 *
 * @example
 * const [search, setSearch] = useURLState('search', '');
 * const [category, setCategory] = useURLState('category', 'all');
 *
 * // URL updates automatically: /recursos?search=wallet&category=defi
 * // Users can share URLs with filters applied
 */
export function useURLState(
  paramName: string,
  defaultValue: string
): [string, (value: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams?.get(paramName) || defaultValue;

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');

      if (newValue === defaultValue || !newValue) {
        // Remove param if it's the default value
        params.delete(paramName);
      } else {
        // Set param
        params.set(paramName, newValue);
      }

      const search = params.toString();
      const query = search ? `?${search}` : '';

      // Update URL without reload (client-side navigation)
      router.push(`${pathname}${query}`, { scroll: false });
    },
    [paramName, defaultValue, pathname, router, searchParams]
  );

  return [value, setValue];
}
