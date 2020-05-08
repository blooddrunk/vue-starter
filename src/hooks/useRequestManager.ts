import { onBeforeUnmount } from 'vue';
import Axios, { AxiosRequestConfig } from 'axios';

import { RequestManager } from '@/utils/axios/RequestManager';

export default ({ cancelOnUnmount = true } = {}) => {
  let requestManager = new RequestManager();

  const enhance = (requestID: string, requestConfig: AxiosRequestConfig) => {
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

  const remove = (requestID: string) => {
    requestManager && requestManager.remove(requestID);
  };

  const cancel = (requestID: string, reason: string) => {
    requestManager && requestManager.cancel(requestID, reason);
  };

  const cancelAll = (reason: string) => {
    requestManager && requestManager.cancelAll(reason);
  };

  if (cancelOnUnmount) {
    onBeforeUnmount(() => {
      cancelAll(
        `[useRequestManager]: cancelling request due to component unmount`
      );
    });
  }

  return {
    requestManager,
    enhance,
    remove,
    cancel,
    cancelAll,
  };
};
