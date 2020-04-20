import { getLogger } from '@/utils/common';

export default class RequestManager {
  constructor(options = {}, installRequests = []) {
    this.options = options;
    this.requests = new Map(installRequests);
  }

  add(requestID, cancelFn) {
    this.log(`Adding request '${requestID}'`);

    if (this.requests.has(requestID)) {
      this.cancel(requestID, `Duplicate request '${requestID}', cancelling...`);
    }

    this.requests.set(requestID, cancelFn);
  }

  remove(requestID) {
    this.log(`Removing request '${requestID}'`);
    this.requests.delete(requestID);
  }

  cancel(requestID, reason = '') {
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

  async log(message) {
    let { logger } = this.options;
    if (typeof logger === 'undefined') {
      logger = await getLogger();
    }

    if (logger) {
      logger(`[RequestManager]: ${message}`);
    }
  }
}
