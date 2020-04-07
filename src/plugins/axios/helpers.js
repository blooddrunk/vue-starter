import { CancelToken } from 'axios';

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
