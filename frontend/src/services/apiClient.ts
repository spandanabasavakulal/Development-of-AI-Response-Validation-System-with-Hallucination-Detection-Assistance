// Centralized API client for AI Response Quality Evaluation System
// Compatible with FastAPI / Python backend, with local persistence fallback for development & demo mode

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiStatus {
  isBackendConnected: boolean;
  endpoint: string;
  mode: 'Live API' | 'Demo / Simulation Mode';
}

export const getApiStatus = async (): Promise<ApiStatus> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      return { isBackendConnected: true, endpoint: API_BASE_URL, mode: 'Live API' };
    }
  } catch {
    // Expected fallback when local Python FastAPI server is not currently running
  }
  return { isBackendConnected: false, endpoint: API_BASE_URL, mode: 'Demo / Simulation Mode' };
};

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    return res.json();
  },
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    return res.json();
  },
};
