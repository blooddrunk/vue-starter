import { isClient } from './common';

type BuiltInLoggerTypes = {
  log: string;
  info: string;
  warn: string;
  error: string;
};

type ExtraLoggerTypes = {
  success: string;
};

type BaseLoggerTypes = BuiltInLoggerTypes & ExtraLoggerTypes;

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

  private createDefaultLogger(type: keyof BaseLoggerTypes) {
    const sourceType = type === 'success' ? 'log' : type;

    return console[sourceType].bind(
      console,
      `%c${type}`,
      this.getBadgeStyle(this.options[type])
    );
  }

  log = this.createDefaultLogger('log');
  info = this.createDefaultLogger('info');
  warn = this.createDefaultLogger('warn');
  error = this.createDefaultLogger('error');
  success = this.createDefaultLogger('success');

  bark(bark: any, l = bark.toString().length / 1.66) {
    console.log(
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

if (!console.success) {
  console.success = console.log.bind(console);
}

export const logger = isClient() ? new BaseLogger() : console;

if (!console.bark) {
  console.bark = logger.bark.bind(console);
}
