import Axios, {
  AxiosInstance,
  AxiosStatic,
  AxiosPromise,
  Canceler,
  CancelTokenSource,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import defaultsDeep from 'lodash/defaultsDeep';

import { logger } from '@/utils/logger';
import { RequestManager, RequestManagerOptions } from './RequestManager';

// stolen from nuxt-axios https://github.com/nuxt-community/axios-module
type AxiosRequestHelpers = {
  $request: AxiosInstance['request'];
  $get: AxiosInstance['get'];
  $delete: AxiosInstance['delete'];
  $head: AxiosInstance['head'];
  $options: AxiosInstance['options'];
  $post: AxiosInstance['post'];
  $put: AxiosInstance['put'];
  $patch: AxiosInstance['patch'];
};

type AxiosExtraMethods = {
  onRequest(callback: (config: AxiosRequestConfig) => AxiosRequestConfig): void;
  onResponse<T = unknown>(
    callback: (response: AxiosResponse<T>) => AxiosResponse<T>
  ): void;
  onError(callback: (error: AxiosError) => unknown): void;
  onRequestError(callback: (error: AxiosError) => unknown): void;
  onResponseError(callback: (error: AxiosError) => unknown): void;
};

export type EnhancedAxiosInstance = AxiosRequestHelpers &
  AxiosExtraMethods &
  AxiosStatic;

// Request helpers ($get, $post, ...)
const addRequestHelpers = (axiosInstance: EnhancedAxiosInstance) => {
  for (const method of [
    'request',
    'get',
    'delete',
    'head',
    'options',
    'post',
    'put',
    'patch',
  ] as const) {
    type AxiosRequestHelpersKey = keyof AxiosRequestHelpers;
    axiosInstance[`$${method}` as AxiosRequestHelpersKey] = function (
      ...args: unknown[]
    ) {
      return (axiosInstance[method] as any)(...args).then(
        (res: AxiosResponse) => res && res.data
      );
    };
  }
};

const addExtraMethods = (axiosInstance: EnhancedAxiosInstance) => {
  axiosInstance.onRequest = (fn) => {
    axiosInstance.interceptors.request.use((config) => fn(config) || config);
  };

  axiosInstance.onResponse = (fn) => {
    axiosInstance.interceptors.response.use(
      (response) => fn(response) || response
    );
  };

  axiosInstance.onRequestError = (fn) => {
    axiosInstance.interceptors.request.use(
      undefined,
      (error) => fn(error) || Promise.reject(error)
    );
  };

  axiosInstance.onResponseError = (fn) => {
    axiosInstance.interceptors.response.use(
      undefined,
      (error) => fn(error) || Promise.reject(error)
    );
  };

  axiosInstance.onError = (fn) => {
    axiosInstance.onRequestError(fn);
    axiosInstance.onResponseError(fn);
  };
};

const setupDebugInterceptor = async (axiosInstance: EnhancedAxiosInstance) => {
  axiosInstance.interceptors.request.use(undefined, (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      logger.success(
        `[${res.status}]`,
        `[${res.config.method?.toUpperCase()}]`,
        res.config.url
      );

      logger.info(res);

      return res;
    },
    (error) => {
      if (axiosInstance.isCancel(error)) {
        logger.warn(error);
      } else {
        logger.error('error', 'Response error:', error);
      }
      return Promise.reject(error);
    }
  );
};

export const createAxiosInstance = (extraOptions: AxiosRequestConfig) => {
  const headers = {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
    delete: {},
    get: {},
    head: {},
    post: {},
    put: {},
    patch: {},
  };

  const axiosOptions: AxiosRequestConfig = {
    headers,
  };

  // Create new axios instance
  const axios = Axios.create(
    defaultsDeep(extraOptions, axiosOptions)
  ) as EnhancedAxiosInstance;

  // Extend axios proto
  addRequestHelpers(axios);
  addExtraMethods(axios);

  axios.CancelToken = Axios.CancelToken;
  axios.isCancel = Axios.isCancel;

  if (__DEV__) {
    setupDebugInterceptor(axios);
  }

  return axios;
};

export type CancellableFnType = {
  (config: any): AxiosPromise;
} & {
  cancel?: Canceler;
};

export const takeLatest = (axios: EnhancedAxiosInstance) => {
  let source: CancelTokenSource;

  const cancellableCall: CancellableFnType = (config) => {
    if (source) {
      source.cancel(`[${config.url}]: Only one request allowed at a time.`);
    }

    source = Axios.CancelToken.source();
    cancellableCall.cancel = source.cancel;

    return axios({
      ...config,
      cancelToken: source.token,
    });
  };

  return cancellableCall;
};

// export const setupProgress = (axios: EnhancedAxiosInstance) => {

// }

export const setupRequestManager = (
  axios: EnhancedAxiosInstance,
  options: RequestManagerOptions = {}
) => {
  const requestManager = new RequestManager(options);

  const getRequestId = ({ __cancellable, method, url }: AxiosRequestConfig) => {
    let requestId;
    if (__cancellable === true) {
      // auto-set requestId
      requestId = `${method}_${url}`;
    } else if (typeof __cancellable === 'string') {
      requestId = __cancellable;
    }

    return requestId;
  };

  axios.interceptors.request.use((config) => {
    const requestId = getRequestId(config);

    if (requestId) {
      const source = Axios.CancelToken.source();
      config.cancelToken = source.token;
      requestManager.add(requestId, source.cancel);
    }

    return config;
  });

  axios.interceptors.response.use((response) => {
    const requestId = getRequestId(response.config);
    if (requestId) {
      requestManager.remove(requestId);
    }

    return response;
  });

  axios.cancel = (requestId, reason) => {
    requestManager.cancel(requestId, reason);
  };

  axios.cancelAll = (reason) => {
    requestManager.cancelAll(reason);
  };
};
