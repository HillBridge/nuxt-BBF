export interface JdError extends Error {
  code: string;
  type: "BUSINESS" | "NETWORK" | "AUTH" | "SYSTEM";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isRetryable?: boolean;
  timestamp?: number;
  userImpact?: string;
  recoveryActions?: string[];
  metadata?: Record<string, any>;
}

export interface ErrorContext {
  route: string;
  component: string;
  userState: any;
  deviceType: string;
}

declare global {
  interface JdError extends Error {
    code: string;
    type: "BUSINESS" | "NETWORK" | "AUTH" | "SYSTEM";
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    isRetryable?: boolean;
    timestamp?: number;
    userImpact?: string;
    recoveryActions?: string[];
    metadata?: Record<string, any>;
  }

  interface ErrorContext {
    route: string;
    component: string;
    userState: any;
    deviceType: string;
  }
}
