import { isClient } from './common';

type BaseLoggerTypes = {
  log: string;
  info: string;
  warn: string;
  error: string;
  success: string;
};

export class BaseLogger {
  constructor(
    private options: BaseLoggerTypes = {
      log: '#7f8c8d',
      info: '#00BCD4',
      warn: '#f39c12',
      error: '#c0392b',
      success: '#2ecc71',
    }
  ) {}

  private getBadgeStyle(color: string) {
    return `
      background: ${color};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `;
  }

  private createDefaultLogger(
    type: keyof BaseLoggerTypes,
    badge: string = type
  ) {
    const sourceType = type === 'success' ? 'log' : type;

    (console as any)[`__${sourceType}`] = console[sourceType];

    return console[sourceType].bind(
      console,
      `%c${badge}`,
      this.getBadgeStyle(this.options[type])
    );
  }

  log = this.createDefaultLogger('log');
  info = this.createDefaultLogger('info');
  warn = this.createDefaultLogger('warn');
  error = this.createDefaultLogger('error');
  success = this.createDefaultLogger('success');

  bark(
    bark: string | number | Array<unknown> | Record<string, unknown>,
    l = bark.toString().length / 1.66
  ): void {
    const log = console.__log ? console.__log : console.log;
    log(
      `
         /‾${`‾‾`.repeat(l)}‾
    🐶  < `,
      bark,
      `
         \\_${`__`.repeat(l)}_
    `
    );
  }
}

export const logger = isClient() ? new BaseLogger() : console;

export const install = () => {
  console.bark = logger.bark.bind(console);

  if (isClient()) {
    (['log', 'info', 'warn', 'error', 'success'] as const).forEach(
      (method: keyof BaseLoggerTypes) => {
        console[method] = logger[method].bind(console);
      }
    );
  } else {
    console.success = console.log.bind(console);
  }
};

export const uninstall = () => {
  if (isClient()) {
    (['log', 'info', 'warn', 'error'] as const).forEach((method) => {
      const originalMethod = `__${method}`;
      if ((console as any)[originalMethod]) {
        console[method] = (console as any)[originalMethod];
        delete (console as any)[originalMethod];
      }
    });
  }
};
