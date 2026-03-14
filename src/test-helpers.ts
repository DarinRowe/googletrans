type AsyncFn<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

const RETRYABLE_ERROR_CODES = new Set(["ECONNRESET", "ECONNABORTED", "ENOTFOUND", "ETIMEDOUT"]);
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isJestAssertionError(error: unknown) {
  return error instanceof Error && "matcherResult" in error;
}

function isRetryableNetworkError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const maybeError = error as Error & {
    code?: string;
    response?: { status?: number };
  };

  if (maybeError.code && RETRYABLE_ERROR_CODES.has(maybeError.code)) {
    return true;
  }

  if (maybeError.response?.status && RETRYABLE_STATUS_CODES.has(maybeError.response.status)) {
    return true;
  }

  const message = maybeError.message.toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("socket hang up") ||
    message.includes("network error") ||
    message.includes("temporary")
  );
}

export async function withNetworkRetries<T>(run: () => Promise<T>, attempts = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      if (!isRetryableNetworkError(error) || attempt === attempts - 1) {
        throw error;
      }

      lastError = error;
      await sleep(250 * (attempt + 1));
    }
  }

  throw lastError;
}

export function createRetriableAsyncFn<TArgs extends unknown[], TResult>(
  fn: AsyncFn<TArgs, TResult>,
  attempts = 3
) {
  return (...args: TArgs) => withNetworkRetries(() => fn(...args), attempts);
}

export function expectTextVariant(actual: string, expected: string | string[]) {
  const variants = Array.isArray(expected) ? expected : [expected];
  expect(variants).toContain(actual);
}

export const testConsole = {
  log(value: unknown) {
    if (isJestAssertionError(value)) {
      throw value;
    }

    globalThis.console.log(value);
  },
};
