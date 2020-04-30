import { Canceler } from 'axios';

import { isDev } from '@/utils/common';
import { logger } from '@/utils/logger';

export type RequestManagerOptions = {
  logger?: (...args: any[]) => any;
};

export class RequestManager {
  requests: Map<string, Canceler>;

  constructor(public options: RequestManagerOptions = { logger: logger.info }) {
    this.options = options;
    this.requests = new Map();
  }

  add(requestID: string, cancelFn: Canceler) {
    this.log(`Adding request '${requestID}'`);

    if (this.requests.has(requestID)) {
      this.cancel(requestID, `Duplicate request '${requestID}', cancelling...`);
    }

    this.requests.set(requestID, cancelFn);
  }

  remove(requestID: string) {
    this.log(`Removing request '${requestID}'`);
    this.requests.delete(requestID);
  }

  cancel(requestID: string, reason = '') {
    if (this.requests.has(requestID)) {
      this.requests.get(requestID)!(reason);
      this.remove(requestID);
      this.log(`Request '${requestID}' cancelled`);
    }
  }

  cancelAll(reason = '') {
    this.requests.forEach((cancelFn, key) => {
      cancelFn(reason);
      this.remove(key);
      this.log(`Request '${key}' cancelled`);
    });
  }

  async log(message: string) {
    if (isDev()) {
      return;
    }

    const { logger } = this.options;
    if (logger) {
      logger(`[RequestManager]: ${message}`);
    }
  }
}
