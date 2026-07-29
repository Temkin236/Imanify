import { API_BASE_URL } from '../../config/api';

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
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...getAuthHeaders(token),
        ...(options.headers ?? {})
      }
    });
  } catch {
    throw new Error(
      `Cannot reach the server at ${API_BASE_URL}. Check VITE_API_BASE_URL in Vercel (use https://imanify-8.onrender.com/api).`
    );
  }

  let payload: ApiResponse<T> = {} as ApiResponse<T>;
  const text = await response.text();

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    // Handle invalid JSON explicitly
  }

  if (!response.ok || payload.success === false) {
    if (response.status === 401) {
      throw new Error(payload.error ?? 'Invalid email or password. On the live app, register a new account first.');
    }
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return (payload.data !== undefined ? payload.data : null) as unknown as T;
}

export { API_BASE_URL };
