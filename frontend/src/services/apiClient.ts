
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiStatus {
  isBackendConnected: boolean;
  endpoint: string;
  mode: 'Live API' | 'Demo / Simulation Mode';
}

export const getApiStatus = async (): Promise<ApiStatus> => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 65000);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });

    if (response.ok) {
      return {
        isBackendConnected: true,
        endpoint: API_BASE_URL,
        mode: 'Live API',
      };
    }
  } catch (error) {
    console.error('Backend health check failed:', error);
  } finally {
    clearTimeout(timeoutId);
  }

  return {
    isBackendConnected: false,
    endpoint: API_BASE_URL,
    mode: 'Demo / Simulation Mode',
  };
};

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
      throw new Error(
        `HTTP Error ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  },

  post: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.detail ||
        `HTTP Error ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  },
};
