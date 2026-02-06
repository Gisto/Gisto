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

  const data =
    method === 'DELETE'
      ? null
      : response.headers.get('Content-Type')?.includes('application/json')
        ? await response.json()
        : await response.text();

  return { data: data as T, headers: response.headers, status: response.status };
}
