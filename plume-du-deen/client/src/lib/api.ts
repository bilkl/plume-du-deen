const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function inferDefaultApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  const host = window.location.hostname;
  const isProductionDomain = host === 'plume-du-deen.com' || host === 'www.plume-du-deen.com';
  const isGithubPages = host.endsWith('.github.io');

  if (isProductionDomain || isGithubPages) return 'https://plume-du-deen.vercel.app';
  return '';
}

const baseUrl = (rawBaseUrl || inferDefaultApiBaseUrl()).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}
