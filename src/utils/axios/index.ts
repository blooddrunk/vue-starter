// import { provide, inject } from 'vue';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import defaultsDeep from 'lodash/defaultsDeep';
import isPlainObject from 'lodash/isPlainObject';

import { createAxiosInstance, EnhancedAxiosInstance } from './enhance';
import { jsonToUrlParams } from '@/utils/common';

declare module 'axios' {
  interface AxiosRequestConfig {
    __cancellable?: boolean | string;
    __showProgress?: boolean;
    __needValidation?: boolean;
    __urlEncoded?: boolean;
    __transformData?: boolean | ((data: unknown) => unknown);
  }

  interface AxiosInstance {
    cancel?: (requestId: string, reason: string) => void;
    cancelAll?: (reason: string) => void;
  }
}

const apiRoot = process.env.VUE_APP_API_ROOT;

export const defaultDataTransformer = (data: unknown = {}) => data;

export type ServerResponse = {
  errcode: number;
  errmsg: string;
  data: unknown;
};

// biz logic
export const validateResponse = (response: ServerResponse) => {
  const { errcode = 200, errmsg = '未知错误', ...ret } = response;

  switch (`${errcode}`) {
    case '200':
      return ret;
    default: {
      throw new Error(errmsg);
    }
  }
};

// http status
const validateStatus = (response: AxiosResponse) => {
  const { status, data } = response;

  console.error(`服务异常: ${status}`, data);

  return data;
};

export const setupInterceptor = (enhancedAxios: EnhancedAxiosInstance) => {
  enhancedAxios.onRequest(({ __urlEncoded, ...config }) => {
    //TODO: deal with request config here
    const presetConfig: AxiosRequestConfig = { method: 'GET' };

    if (__urlEncoded) {
      presetConfig.headers['content-type'] =
        'application/x-www-form-urlencoded';
      if (isPlainObject(config.data)) {
        config.data = jsonToUrlParams(config.data);
      }
    }

    config = defaultsDeep(config, presetConfig);

    return config;
  });

  enhancedAxios.onResponse((response) => {
    const {
      config: { __needValidation = true, __transformData = true },
    } = response;

    if (__needValidation) {
      try {
        response.data = validateResponse(response.data as ServerResponse);
      } catch (error) {
        error.config = response.config;
        throw error;
      }
    }

    try {
      if (typeof __transformData === 'function') {
        response.data = __transformData(response.data);
      } else if (__transformData === true) {
        response.data = defaultDataTransformer(response.data as ServerResponse);
      }
    } catch (error) {
      console.error(error);
      error.config = response.config;
      throw error;
    }

    return response;
  });

  enhancedAxios.onError((error) => {
    console.log(enhancedAxios.isCancel(error));

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const handled = validateStatus(error.response);
      if (typeof handled === 'string') {
        error.message = handled;
      }

      return Promise.reject(error);
    }
  });
};

const axios = createAxiosInstance({
  baseURL: `${apiRoot}`,
});

setupInterceptor(axios);

// TODO: necessary??
// export const install = {
//   install(app) {
//     app.config.globalProperties.$axios = axios;
//   },
// };

// const AxiosSymbol = Symbol('axios');

// export const provideAxios = () => {
//   provide(AxiosSymbol, axios);
// };

// export const injectAxios = () => {
//   const injectedAxios = inject(AxiosSymbol);
//   if (!injectedAxios) {
//     throw new Error('No axios provided');
//   }
//   return injectedAxios;
// };

export default axios;
