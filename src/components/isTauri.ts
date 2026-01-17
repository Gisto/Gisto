export const isTauri = () => {
  if (typeof window === 'undefined') return false;

  // Check multiple ways Tauri can be detected
  return (
    '__TAURI__' in window ||
    '__TAURI_INTERNALS__' in window ||
    // @ts-expect-error __TAURI__
    window.__TAURI__ !== undefined ||
    // @ts-expect-error __TAURI_INTERNALS__
    window.__TAURI_INTERNALS__ !== undefined
  );
};
