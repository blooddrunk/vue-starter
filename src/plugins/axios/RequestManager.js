export default class RequestManager {
  constructor(options = {}, installRequests = []) {
    this.options = options;
    this.requests = new Map(installRequests);
  }

  add(requestId, cancelFn) {
    this.log(`Adding request '${requestId}'`);

    if (this.requests.has(requestId)) {
      this.cancel(requestId, `Duplicate request '${requestId}', cancelling...`);
    }

    this.requests.set(requestId, cancelFn);
  }

  remove(requestId) {
    this.log(`Removing request '${requestId}'`);
    this.requests.delete(requestId);
  }

  cancel(requestId, reason = '') {
    if (this.requests.has(requestId)) {
      this.requests.get(requestId)(reason);
      this.remove(requestId);
      this.log(`Request '${requestId}' cancelled`);
    }
  }

  cancelAll(reason = '') {
    this.requests.forEach((cancelFn, key) => {
      cancelFn(reason);
      this.remove(key);
      this.log(`Request '${key}' cancelled`);
    });
  }

  log(message) {
    const { logger } = this.options;
    const prefix = '[RequestManager]: ';

    if (logger) {
      logger(`${prefix}${message}`);
    }
  }
}
