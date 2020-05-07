import { AxiosRequestConfig, AxiosInstance } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    cancellable?: boolean | string;
    __needValidation?: boolean;
    transformData?: boolean | ((data: unknown) => unknown);
  }

  interface AxiosInstance {
    cancel?: (requestId: string, reason: string) => void;
    cancelAll?: (reason: string) => void;
  }
}
