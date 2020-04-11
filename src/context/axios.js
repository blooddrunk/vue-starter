import { provide, inject } from 'vue';
import defaultsDeep from 'lodash/defaultsDeep';

import consola from 'consola';

import { createAxiosInstance, useRequestManager } from '@/utils/axios';

const isDev = process.env.NODE_ENV === 'development';
const apiRoot = process.env.VUE_APP_API_ROOT;

export const defaultDataTransformer = (data = {}) => data;

// biz logic
export const validateResponse = (response) => {
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
const validateStatus = (response) => {
  const { status, data } = response;

  console.error(`服务异常: ${status}`, data);

  return data;
};

export const setupInterceptor = (enhancedAxios) => {
  enhancedAxios.onRequest((config) => {
    //TODO: deal with request config here
    config = defaultsDeep(config, { method: 'GET' });

    return config;
  });

  enhancedAxios.onResponse((response) => {
    const {
      config: { __needValidation = true, transformData = true },
    } = response;

    if (__needValidation) {
      try {
        response.data = validateResponse(response.data);
      } catch (error) {
        error.config = response.config;
        throw error;
      }
    }

    if (typeof transformData === 'function') {
      response.data = transformData(response.data);
    } else if (transformData === true) {
      response.data = defaultDataTransformer(response.data);
    }
  });

  enhancedAxios.onError((error) => {
    // FIXME CAN NOT depend on config property when using CancelToken, it's undefined
    if (enhancedAxios.isCancel(error)) {
      // do something maybe
    }

    let handled = false;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      handled = validateStatus(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    }

    error.handled = handled;
    if (typeof handled === 'string') {
      error.message = handled;
    }

    return Promise.reject(error);
  });
};

const axios = createAxiosInstance({
  baseURL: `${apiRoot}`,
});
useRequestManager(axios, {
  logger: isDev ? consola.info : null,
});
setupInterceptor(axios);

// TODO: necessary??
export const install = {
  install(app) {
    app.config.globalProperties.$axios = axios;
  },
};

const AxiosSymbol = Symbol('axios');

export const provideAxios = () => {
  provide(AxiosSymbol, axios);
};

export const useAxios = () => {
  const injectedAxios = inject(AxiosSymbol);
  if (!injectedAxios) {
    throw new Error('No axios provided');
  }
  return injectedAxios;
};
