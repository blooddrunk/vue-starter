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

declare global {
  interface Console {
    bark: typeof console.log;
    success: typeof console.log;
  }

  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging' | 'test';
      VUE_APP_API_ROOT: string;
      VUE_APP_API_PREFIX: string;
      VUE_APP_PUBLIC_PATH: string;
      VUE_APP_JSON_SERVER_PATH: string;
    }
  }
}

// FIXME: not optimal?
declare module 'vue-router' {
  interface RouteLocationNormalizedLoaded {
    meta: RouteMeta;
  }
}
