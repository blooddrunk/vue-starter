import { isClient } from './common';

type BaseLoggerTypes = {
  log: string;
  info: string;
  warn: string;
  error: string;
};

export class BaseLogger {
  log!: typeof console.log;
  info!: typeof console.info;
  warn!: typeof console.warn;
  error!: typeof console.error;
  bark: typeof console.log;

  constructor(
    private options: BaseLoggerTypes = {
      log: '#7f8c8d',
      info: '#00BCD4',
      warn: '#f39c12',
      error: '#c0392b',
    }
  ) {
    for (const type in options) {
      // FIXME: unnecessary declaration
      const narrowedType = type as keyof BaseLoggerTypes;

      this[narrowedType] = console[narrowedType].bind(
        console,
        `%c${type}`,
        this.getBadgeStyle(options[narrowedType])
      );
    }

    this.bark = (bark: any, l = bark.toString().length / 1.66) => {
      console.log(
        `
           /‾${`‾‾`.repeat(l)}‾
      🐶  < `,
        bark,
        `
           \\_${`__`.repeat(l)}_
      `
      );
    };
  }

  private getBadgeStyle(color: string) {
    return `
      background: ${color};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `;
  }
}

export const logger = isClient() ? new BaseLogger() : console;
