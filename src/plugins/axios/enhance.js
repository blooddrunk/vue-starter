import Axios from 'axios';
import defaultsDeep from 'lodash/defaultsDeep';
import consola from 'consola';

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
    this.interceptors.request.use(config => fn(config) || config);
  },
  onResponse(fn) {
    this.interceptors.response.use(response => fn(response) || response);
  },
  onRequestError(fn) {
    this.interceptors.request.use(
      undefined,
      error => fn(error) || Promise.reject(error)
    );
  },
  onResponseError(fn) {
    this.interceptors.response.use(
      undefined,
      error => fn(error) || Promise.reject(error)
    );
  },
  onError(fn) {
    this.onRequestError(fn);
    this.onResponseError(fn);
  },
  create(options) {
    return createAxiosInstance(defaultsDeep(options, this.defaults));
  }
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
  'patch'
]) {
  axiosExtra['$' + method] = function() {
    return this[method].apply(this, arguments).then(res => res && res.data);
  };
}

const extendAxiosInstance = axios => {
  for (let key in axiosExtra) {
    axios[key] = axiosExtra[key].bind(axios);
  }
};

const createAxiosInstance = axiosOptions => {
  // Create new axios instance
  const axios = Axios.create(axiosOptions);
  axios.CancelToken = Axios.CancelToken;
  axios.isCancel = Axios.isCancel;

  // Extend axios proto
  extendAxiosInstance(axios);

  if (isDev) {
    setupDebugInterceptor(axios);
  }

  return axios;
};

const setupDebugInterceptor = axios => {
  axios.onRequestError(error => {
    consola.error('Request error:', error);
  });

  axios.onResponseError(error => {
    consola.error('error', 'Response error:', error);
  });

  axios.onResponse(res => {
    consola.success(
      '[' + (res.status + ' ' + res.statusText) + ']',
      '[' + res.config.method.toUpperCase() + ']',
      res.config.url
    );

    consola.info(res);

    return res;
  });
};

export const createEnhancedAxiosInstance = extraOptions => {
  const headers = {
    common: {
      Accept: 'application/json, text/plain, */*'
    },
    delete: {},
    get: {},
    head: {},
    post: {},
    put: {},
    patch: {}
  };

  const axiosOptions = {
    headers
  };

  const axios = createEnhancedAxiosInstance(
    defaultsDeep(extraOptions, axiosOptions)
  );

  return axios;
};
