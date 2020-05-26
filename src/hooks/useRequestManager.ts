import { onBeforeUnmount } from 'vue';

import { RequestManager } from '@/utils/axios/RequestManager';

export const useRequestManager = ({
  cancelOnUnmount = true,
} = {}): RequestManager => {
  const requestManager = new RequestManager();

  if (cancelOnUnmount) {
    onBeforeUnmount(() => {
      requestManager.cancelAll(
        `[useRequestManager]: cancelling request due to component unmount`
      );
    });
  }

  return requestManager;
};
