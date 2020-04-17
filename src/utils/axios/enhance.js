import Axios, { CancelToken } from 'axios';
import defaultsDeep from 'lodash/defaultsDeep';
import consola from 'consola';

import RequestManager from './RequestManager';

const isDev = process.env.NODE_ENV === 'development';

// stolen from nuxt-axios https://github.com/nuxt-community/axios-module
const axiosExtra = {
  setBaseURL(baseURL) {
    this.defaults.baseURL = baseURL;
  },
  setHeader(name, value, scopes = 'common') {
    for (let scope of Array.isArray(scopes) ? scopes : [scopes]) {
      if (!value) {
        delete this.defaults.headers[scope][name];
        return;
      }
      this.defaults.headers[scope][name] = value;
    }
  },
  setToken(token, type, scopes = 'common') {
    const value = !token ? null : (type ? type + ' ' : '') + token;
    this.setHeader('Authorization', value, scopes);
  },
  onRequest(fn) {
    this.interceptors.request.use((config) => fn(config) || config);
  },
  onResponse(fn) {
    this.interceptors.response.use((response) => fn(response) || response);
  },
  onRequestError(fn) {
    this.interceptors.request.use(
      undefined,
      (error) => fn(error) || Promise.reject(error)
    );
  },
  onResponseError(fn) {
    this.interceptors.response.use(
      undefined,
      (error) => fn(error) || Promise.reject(error)
    );
  },
  onError(fn) {
    this.onRequestError(fn);
    this.onResponseError(fn);
  },
  create(options) {
    return createAxiosInstance(defaultsDeep(options, this.defaults));
  },
};

// Request helpers ($get, $post, ...)
for (let method of [
  'request',
  'delete',
  'get',
  'head',
  'options',
  'post',
  'put',
  'patch',
]) {
  axiosExtra['$' + method] = function () {
    return this[method].apply(this, arguments).then((res) => res && res.data);
  };
}

const extendAxiosInstance = (axios) => {
  for (let key in axiosExtra) {
    axios[key] = axiosExtra[key].bind(axios);
  }
};

const setupDebugInterceptor = (axios) => {
  axios.onRequestError((error) => {
    consola.error('Request error:', error);
  });

  axios.onResponseError((error) => {
    consola.error('error', 'Response error:', error);
  });

  axios.onResponse((res) => {
    consola.success(
      '[' + (res.status + ' ' + res.statusText) + ']',
      '[' + res.config.method.toUpperCase() + ']',
      res.config.url
    );

    consola.info(res);

    return res;
  });
};

export const createAxiosInstance = (extraOptions) => {
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

  const axiosOptions = {
    headers,
  };

  // Create new axios instance
  const axios = Axios.create(defaultsDeep(extraOptions, axiosOptions));
  axios.CancelToken = Axios.CancelToken;
  axios.isCancel = Axios.isCancel;

  // Extend axios proto
  extendAxiosInstance(axios);

  if (isDev) {
    setupDebugInterceptor(axios);
  }

  return axios;
};

export const takeLatest = (axios) => {
  let source;

  const cancellableCall = (config) => {
    if (source) {
      source.cancel(`[${config.url}]: Only one request allowed at a time.`);
    }

    source = CancelToken.source();
    cancellableCall.cancel = source.cancel;

    return axios({
      ...config,
      cancelToken: source.token,
    });
  };

  return cancellableCall;
};

export const useRequestManager = (axios, options = {}) => {
  const requestManager = new RequestManager(options);

  const getRequestId = ({ cancellable, method, url }) => {
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
      const source = CancelToken.source();
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
