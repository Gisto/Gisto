/** Reads the response body according to the request method and content type. */
async function readBody<T>(response: Response, method: string): Promise<T | null> {
  if (method === 'DELETE') return null;
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

type RequestParams = {
  baseUrl: string;
  endpoint?: string;
  method?: string;
  headers: Record<string, string>;
  body?: Record<string, unknown>;
  onUnauthorized?: () => void;
};

export async function requestApi<T>({
  baseUrl,
  endpoint = '',
  method = 'GET',
  headers,
  body,
  onUnauthorized,
}: RequestParams): Promise<{ data: T; headers: Headers; status: number }> {
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const response: Response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status > 399) {
    if (response.status === 401) {
      onUnauthorized?.();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await readBody<T>(response, method);

  return { data: data as T, headers: response.headers, status: response.status };
}
