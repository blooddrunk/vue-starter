// import { provide, inject } from 'vue';
import { AxiosResponse } from 'axios';
import defaultsDeep from 'lodash/defaultsDeep';

import { createAxiosInstance, EnhancedAxiosInstance } from './enhance';

const apiRoot = process.env.VUE_APP_API_ROOT;

export const defaultDataTransformer = (data = {}) => data;

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
  enhancedAxios.interceptors.request.use((config) => {
    //TODO: deal with request config here
    config = defaultsDeep(config, { method: 'GET' });

    return config;
  });

  enhancedAxios.interceptors.response.use(
    (response) => {
      const {
        config: { __needValidation = true, __transformData = true },
      } = response;

      if (__needValidation) {
        try {
          response.data = validateResponse(response.data);
        } catch (error) {
          error.config = response.config;
          throw error;
        }
      }

      if (typeof __transformData === 'function') {
        response.data = __transformData(response.data);
      } else if (__transformData === true) {
        response.data = defaultDataTransformer(response.data);
      }

      return response;
    },
    // only care about response error
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const handled = validateStatus(error.response);
        if (typeof handled === 'string') {
          error.message = handled;
        }

        return Promise.reject(error);
      }
    }
  );
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
