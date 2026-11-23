/**
 * Ultra-fast fetch wrapper with strict SSR timeout guards.
 * Prevents Render cold-starts or remote network latency from blocking SSR.
 */

export const fastApiFetch = async (
  endpoint: string,
  options: RequestInit & { timeoutMs?: number } = {}
) => {
  const BACKEND_URL =
    import.meta.env.VITE_WEBSITE_BACKEND_URL ||
    process.env.VITE_WEBSITE_BACKEND_URL ||
    "https://shailrajtravels.onrender.com/api";

  const isWrite =
    options.method &&
    ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase());

  const isAdminOrSpecial =
    isWrite ||
    endpoint.startsWith('/bookings') ||
    endpoint.startsWith('/audit') ||
    endpoint.includes('template');

  // Strict timeout for SSR public read operations so SSR is never blocked (3000ms).
  // 45000ms for bookings, admin endpoints, and write operations to allow database persistence.
  const defaultTimeout = isAdminOrSpecial ? 45000 : 3000;
  const timeoutMs = options.timeoutMs ?? defaultTimeout;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(errorText || `API Error: ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      // Return a graceful timeout error without crashing
      const timeoutError: any = new Error(`Request timed out after ${timeoutMs}ms while communicating with ${endpoint}`);
      timeoutError.isTimeout = true;
      throw timeoutError;
    }
    throw err;
  }
};

export const apiFetch = fastApiFetch;
