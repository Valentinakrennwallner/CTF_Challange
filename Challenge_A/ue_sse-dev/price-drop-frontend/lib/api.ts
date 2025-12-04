/**
 * Constructs the full API URL by combining the base URL from the environment
 * with the provided path.
 * @param path The path of the API endpoint (e.g., "/api/products").
 * @returns The full URL for the API endpoint.
 */
export const apiUrl = (path: string | null | undefined): string => {
  // Use the standard Next.js public environment variable.
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    // This fallback is a safety net for local development if the env var is not set.
    // In a production/docker environment, the variable should always be defined.
    const localBaseUrl = 'http://localhost:5000';
    console.warn(`NEXT_PUBLIC_API_BASE_URL is not defined. Falling back to ${localBaseUrl}.`);
    
    if (!path) return '';
    const normalizedBase = localBaseUrl.endsWith('/') ? localBaseUrl.slice(0, -1) : localBaseUrl;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${normalizedBase}/${normalizedPath}`;
  }

  if (!path) {
    return '';
  }

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBaseUrl}/${normalizedPath}`;
};
