import { Canceler } from 'axios';

import { getLogger } from '@/utils/common';

export type RequestManagerOptions = {
  logger?: (...args: any[]) => any;
};

export default class RequestManager {
  requests: Map<string, Canceler>;

  constructor(public options: RequestManagerOptions = {}) {
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
      this.requests.get(requestID)(reason);
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
    let { logger } = this.options;
    if (typeof logger === 'undefined') {
      logger = await getLogger();
    }

    if (logger) {
      logger(`[RequestManager]: ${message}`);
    }
  }
}
