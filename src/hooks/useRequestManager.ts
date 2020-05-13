import { onBeforeUnmount } from 'vue';
import Axios, { AxiosRequestConfig } from 'axios';

import { RequestManager } from '@/utils/axios/RequestManager';

export default ({ cancelOnUnmount = true } = {}) => {
  let requestManager = new RequestManager();

  const enhanceAxios = (
    requestID: string,
    requestConfig: AxiosRequestConfig
  ) => {
    if (!requestID) {
      throw new Error(`[useRequestManager]: requestID required`);
    }

    if (!requestManager) {
      requestManager = new RequestManager();
    }

    const source = Axios.CancelToken.source();
    requestManager.add(requestID, source.cancel);

    return {
      ...requestConfig,
      cancelToken: source.token,
    };
  };

  if (cancelOnUnmount) {
    onBeforeUnmount(() => {
      requestManager.cancelAll(
        `[useRequestManager]: cancelling request due to component unmount`
      );
    });
  }

  return {
    requestManager,
    enhanceAxios,
  };
};
