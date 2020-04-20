
import { onBeforeUnmount } from 'vue';

import { RequestManager } from '@/utils/axios';

export default ({ cancelOnUnmounted } => {}) => {
  let requestManager;
  
  const enhance = (requestID, requestConfig) => {
    if(!requestID) {
      throw new Error(`[useRequestManager]: requestID required`)
    }

    if(!requestManager) {
      requestManager = new RequestManager({
        
      })
    }
  }
}
