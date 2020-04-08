import { CancelToken } from 'axios';

import RequestManager from './RequestManager';

export const takeLatest = axios => {
  let source;

  const cancellableCall = config => {
    if (source) {
      source.cancel(`[${config.url}]: Only one request allowed at a time.`);
    }

    source = CancelToken.source();
    cancellableCall.cancel = source.cancel;

    return axios({
      ...config,
      cancelToken: source.token
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

  axios.interceptors.request.use(config => {
    const requestId = getRequestId(config);

    if (requestId) {
      const source = CancelToken.source();
      config.cancelToken = source.token;
      requestManager.add(requestId, source.cancel);
    }

    return config;
  });

  axios.interceptors.response.use(response => {
    const requestId = getRequestId(response.config);
    if (requestId) {
      requestManager.remove(requestId);
    }

    return response;
  });

  axios.cancel = (requestId, reason) => {
    requestManager.cancel(requestId, reason);
  };

  axios.cancelAll = reason => {
    requestManager.cancelAll(reason);
  };
};
