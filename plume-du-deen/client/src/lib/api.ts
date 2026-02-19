const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : '';

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}
