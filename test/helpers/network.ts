type AsyncFn<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

const retryableErrorCodes = new Set([
  "ECONNRESET",
  "ECONNABORTED",
  "ENOTFOUND",
  "ETIMEDOUT",
]);
const retryableStatusCodes = new Set([429, 500, 502, 503, 504]);

function isRetryableNetworkError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const networkError = error as Error & {
    code?: string;
    response?: { status?: number };
  };

  return Boolean(
    (networkError.code && retryableErrorCodes.has(networkError.code)) ||
      (networkError.response?.status &&
        retryableStatusCodes.has(networkError.response.status)) ||
      /timeout|socket hang up|network error|temporary/i.test(networkError.message)
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function withNetworkRetries<TArgs extends unknown[], TResult>(
  fn: AsyncFn<TArgs, TResult>,
  attempts = 3
) {
  return async (...args: TArgs) => {
    for (let attempt = 1; ; attempt += 1) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt >= attempts || !isRetryableNetworkError(error)) {
          throw error;
        }

        await wait(250 * attempt);
      }
    }
  };
}
