import type { JdError } from "~/types/error";

export function createJdError(options: Partial<JdError>): JdError {
  const defaultCode = `E${Date.now().toString().slice(-6)}`;

  return {
    name: options.name || "JdError",
    message: options.message || "未知错误",
    stack: new Error().stack,
    code: options.code || defaultCode,
    type: options.type || "SYSTEM",
    severity: options.severity || "MEDIUM",
    isRetryable: options.isRetryable ?? true,
    timestamp: Date.now(),
    userImpact: options.userImpact || "服务暂时不可用",
    recoveryActions: options.recoveryActions || ["retry", "home", "contact"],
    metadata: options.metadata || {},
  };
}

// 客户端错误抛出工具
export function throwJdError(options: Partial<JdError>): never {
  const error = createJdError(options);

  // 在客户端抛出错误并触发全局事件
  if (import.meta.client) {
    // 触发全局错误事件，让 JdErrorBoundary 捕获
    const errorEvent = new ErrorEvent("error", {
      error,
      message: error.message,
      filename: "",
      lineno: 0,
      colno: 0,
    });
    window.dispatchEvent(errorEvent);
  }

  // 在服务端和客户端都抛出错误
  throw error;
}

export function wrapPromise<T>(
  promise: Promise<T>,
  context: Partial<ErrorContext>
): Promise<T> {
  return promise.catch((error) => {
    const jdError = isJdError(error)
      ? error
      : createJdError({
          message: error.message,
          metadata: { originalError: error, ...context },
        });

    throw jdError;
  });
}

export function isJdError(error: any): error is JdError {
  return (
    error && typeof error === "object" && "code" in error && "type" in error
  );
}

export function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  boundaryOptions: {
    context: Partial<ErrorContext>;
    fallback?: (error: JdError) => void;
  }
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error: any) {
      const normalized = isJdError(error)
        ? error
        : createJdError({
            message: error.message,
            metadata: { originalError: error },
          });

      if (boundaryOptions.fallback) {
        boundaryOptions.fallback(normalized);
      }

      throw normalized;
    }
  };
}
