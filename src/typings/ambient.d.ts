import type { AxiosRequestConfig, AxiosInstance } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    cancellable?: boolean | string;
    __needValidation?: boolean;
    transformData?: boolean | ((data: any) => any);
    transformPayload?: ({
      data,
      params,
    }: {
      data?: any;
      params?: any;
    }) => { data?: any; params?: any };
  }

  interface AxiosInstance {
    cancel?: (requestId: string, reason: string) => void;
    cancelAll?: (reason: string) => void;
  }
}
