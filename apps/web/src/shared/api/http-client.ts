import { API_BASE_URL } from './config/api';
import { HttpError } from './http-error';

const normalizeUrl = (path: string): string => {
  if (path.startsWith('/api/')) {
    return `${API_BASE_URL}${path.slice('/api'.length)}`;
  }

  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
};

export const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(normalizeUrl(path), {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new HttpError(response.status, body);
  }

  return response.json() as Promise<T>;
};
