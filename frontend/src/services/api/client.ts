const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getAuthHeaders(token?: string): HeadersInit {
  if (!token) {
    return { 'Content-Type': 'application/json' };
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...(options.headers ?? {})
    }
  });

  let payload: ApiResponse<T> = {} as ApiResponse<T>;
  const text = await response.text();

  try {
    payload = text ? JSON.parse(text) : {};
  } catch (e) {
    // Handle invalid JSON explicitly
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error ?? `Request to ${response.url} failed with status ${response.status}`);
  }

  return (payload.data !== undefined ? payload.data : null) as unknown as T;
}

export { API_BASE_URL };
