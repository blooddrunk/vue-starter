import type {
  AxiosInstance,
  AxiosStatic,
  AxiosPromise,
  Canceler,
  CancelTokenSource,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Axios from 'axios';
import defaultsDeep from 'lodash/defaultsDeep';

import { isDev } from '@/utils/common';
import { logger } from '@/utils/logger';
import type { RequestManagerOptions } from './RequestManager';
import { RequestManager } from './RequestManager';

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

type EnhancedAxiosInstance = AxiosRequestHelpers & AxiosStatic;

// Request helpers ($get, $post, ...)
const extendAxiosInstance = (axiosInstance: EnhancedAxiosInstance) => {
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
      ...args: any[]
    ) {
      return (axiosInstance[method] as any)(...args).then(
        (res: AxiosResponse) => res && res.data
      );
    };
  }
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
  extendAxiosInstance(axios);

  axios.CancelToken = Axios.CancelToken;
  axios.isCancel = Axios.isCancel;

  if (isDev()) {
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

export const setupRequestManager = (
  axios: EnhancedAxiosInstance,
  options: RequestManagerOptions = {}
) => {
  const requestManager = new RequestManager(options);

  const getRequestId = ({ cancellable, method, url }: AxiosRequestConfig) => {
    let requestId;
    if (cancellable === true) {
      // auto-set requestId
      requestId = `${method}_${url}`;
    } else if (typeof cancellable === 'string') {
      requestId = cancellable;
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
