// src/lib/debug.ts
export const isDebug =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('debug') === '1';
