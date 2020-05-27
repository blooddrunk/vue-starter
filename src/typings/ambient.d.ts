import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { RouteLocationNormalizedLoaded } from 'vue-router';

import { RouteMeta } from '@/router';

declare module 'axios' {
  interface AxiosRequestConfig {
    __cancellable?: boolean | string;
    __showProgress?: boolean;
    __needValidation?: boolean;
    __transformData?: boolean | ((data: unknown) => unknown);
  }

  interface AxiosInstance {
    cancel?: (requestId: string, reason: string) => void;
    cancelAll?: (reason: string) => void;
  }
}

// FIXME: not optimal?
declare module 'vue-router' {
  interface RouteLocationNormalizedLoaded {
    meta: RouteMeta;
  }
}
