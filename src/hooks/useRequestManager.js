import { onBeforeUnmount } from 'vue';
import { CancelToken } from 'axios';

import RequestManager from '@/utils/axios/RequestManager';

export default ({ cancelOnUnmount = true } = {}) => {
  let requestManager;

  const enhance = (requestID, requestConfig) => {
    if (!requestID) {
      throw new Error(`[useRequestManager]: requestID required`);
    }

    if (!requestManager) {
      requestManager = new RequestManager();
    }

    const source = CancelToken.source();
    requestManager.add(requestID, source.cancel);

    return {
      ...requestConfig,
      cancelToken: source.token,
    };
  };

  const remove = (requestID) => {
    requestManager && requestManager.remove(requestID);
  };

  const cancel = (requestID, reason) => {
    requestManager && requestManager.cancel(requestID, reason);
  };

  const cancelAll = (reason) => {
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
