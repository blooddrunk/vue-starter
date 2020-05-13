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
import Nprogress from 'nprogress';

import { logger } from '@/utils/logger';
import { RequestManager, RequestManagerOptions } from './RequestManager';

// stolen from nuxt-axios https://github.com/nuxt-community/axios-module

type AxiosExtraMethods = {
  onRequest(callback: (config: AxiosRequestConfig) => AxiosRequestConfig): void;
  onResponse<T = unknown>(
    callback: (response: AxiosResponse<T>) => AxiosResponse<T>
  ): void;
  onError(callback: (error: AxiosError) => unknown): void;
  onRequestError(callback: (error: AxiosError) => unknown): void;
  onResponseError(callback: (error: AxiosError) => unknown): void;
};

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

export type EnhancedAxiosInstance = AxiosStatic &
  AxiosExtraMethods &
  AxiosRequestHelpers;

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

const setupDebugInterceptor = async (axiosInstance: EnhancedAxiosInstance) => {
  axiosInstance.onRequestError((error) => {
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

  // Extend axios instance
  addExtraMethods(axios);
  addRequestHelpers(axios);

  axios.CancelToken = Axios.CancelToken;
  axios.isCancel = Axios.isCancel;

  if (__DEV__) {
    setupDebugInterceptor(axios);
  }

  return axios;
};

export type CancellableFnType = {
  (config: AxiosRequestConfig): AxiosPromise;
} & {
  cancel?: Canceler;
};

export const takeLatest = (axiosInstance: EnhancedAxiosInstance) => {
  let source: CancelTokenSource;

  const cancellableCall: CancellableFnType = (config) => {
    if (source) {
      source.cancel(`[${config.url}]: Only one request allowed at a time.`);
    }

    source = Axios.CancelToken.source();
    cancellableCall.cancel = source.cancel;

    return axiosInstance({
      ...config,
      cancelToken: source.token,
    });
  };

  return cancellableCall;
};

export const setupProgress = (axiosInstance: EnhancedAxiosInstance) => {
  let pendingRequests = 0;

  axiosInstance.onRequest((config) => {
    if (config.__showProgress !== false) {
      pendingRequests++;
    }

    return config;
  });
  axiosInstance.onResponse((response) => {
    if (response.config.__showProgress !== false) {
      pendingRequests--;
      if (pendingRequests <= 0) {
        pendingRequests = 0;

        Nprogress.done();
      }
    }

    return response;
  });
};

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

  axios.onRequest((config) => {
    const requestId = getRequestId(config);

    if (requestId) {
      const source = Axios.CancelToken.source();
      config.cancelToken = source.token;
      requestManager.add(requestId, source.cancel);
    }

    return config;
  });

  axios.onResponse((response) => {
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
