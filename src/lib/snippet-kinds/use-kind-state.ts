import { useCallback, useMemo, useState } from 'react';

/**
 * Keeps local state derived from a parsed source in sync with it.
 *
 * The source is re-parsed only when the snippet identity or the underlying
 * content identity changes, so local edits are not clobbered on re-render.
 */
export const useKindState = <S, T>(
  source: S,
  id: string,
  parse: (source: S) => T
): [T, (next: T) => void] => {
  const key = `${id}:${String(source)}`;
  const parsed = useMemo(() => parse(source), [source, parse]);
  const [override, setOverride] = useState<{ key: string; value: T } | null>(null);

  const setValue = useCallback((next: T) => setOverride({ key, value: next }), [key]);

  return [override && override.key === key ? override.value : parsed, setValue];
};
