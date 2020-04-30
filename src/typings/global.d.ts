interface Console {
  bark: typeof console.log;
  success: typeof console.log;
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
