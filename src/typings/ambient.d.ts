declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

declare type FnReturningPromise = (...args: any[]) => Promise<any>;

declare type PromiseType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : never;

declare const __DEV__: boolean;

interface HTMLElement {
  _observe?: {
    init: boolean;
    observer: IntersectionObserver;
  };
}

interface Console {
  bark: typeof console.log;
  success: typeof console.log;
  __log: typeof console.log;
  __info: typeof console.info;
  __warn: typeof console.warn;
  __error: typeof console.error;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'staging' | 'test';
    VUE_APP_API_ROOT: string;
    VUE_APP_API_PREFIX: string;
    VUE_APP_PUBLIC_PATH: string;
    VUE_APP_JSON_SERVER_PATH: string;
  }
}
