type ApiFetchOptions = RequestInit & {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  dedupeKey?: string;
  cacheTtlMs?: number;
  cacheKey?: string;
};

const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 350;

const inFlightRequests = new Map<string, Promise<unknown>>();
const responseCache = new Map<string, { expiresAt: number; data: unknown }>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createTimeoutError = (): Error => {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('The operation timed out.', 'TimeoutError');
  }
  const err = new Error('The operation timed out.');
  err.name = 'TimeoutError';
  return err;
};

const timeoutSignal = (ms: number): AbortSignal => {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(createTimeoutError()), ms);
  return controller.signal;
};

const formatHttpErrorDetail = (detail: unknown): string => {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg?: string }).msg ?? JSON.stringify(item));
        }
        return JSON.stringify(item);
      })
      .join('; ');
  }
  if (detail && typeof detail === 'object') return JSON.stringify(detail);
  return String(detail);
};

const makeRequestKey = (url: string, options: RequestInit, explicitKey?: string) => {
  if (explicitKey) return explicitKey;
  const method = (options.method || 'GET').toUpperCase();
  const body = typeof options.body === 'string' ? options.body : '';
  return `${method}:${url}:${body}`;
};

const shouldRetry = (error: unknown, statusCode?: number) => {
  if (typeof statusCode === 'number') {
    return statusCode >= 500 || statusCode === 429;
  }
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return true;
  }
  return error instanceof TypeError;
};

async function requestJson<T>(url: string, options: ApiFetchOptions): Promise<T> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    ...fetchOptions
  } = options;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: timeoutSignal(timeoutMs),
      });

      if (!response.ok) {
        let detail = `HTTP ${response.status}`;
        try {
          const body = (await response.json()) as { detail?: unknown };
          if (body?.detail !== undefined && body?.detail !== null) {
            detail = formatHttpErrorDetail(body.detail);
          }
        } catch {
          // Keep fallback detail
        }

        if (attempt < retries && shouldRetry(null, response.status)) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        throw new Error(detail);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries && shouldRetry(error)) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error('Request failed');
}

export async function apiFetch<T>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const shouldDedupe = method === 'GET' || Boolean(options.dedupeKey);
  const shouldUseCache = method === 'GET' && (options.cacheTtlMs ?? 0) > 0;
  const cacheKey = options.cacheKey || makeRequestKey(url, options, options.dedupeKey);

  if (shouldUseCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }
  }

  if (!shouldDedupe) {
    return requestJson<T>(url, options);
  }

  const key = makeRequestKey(url, options, options.dedupeKey);
  const existing = inFlightRequests.get(key);
  if (existing) return existing as Promise<T>;

  const requestPromise = requestJson<T>(url, options)
    .then((data) => {
      if (shouldUseCache) {
        responseCache.set(cacheKey, {
          expiresAt: Date.now() + (options.cacheTtlMs as number),
          data,
        });
      }
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });
  inFlightRequests.set(key, requestPromise);

  return requestPromise;
}
