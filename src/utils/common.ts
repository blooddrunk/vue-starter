const isDev = process.env.NODE_ENV === 'development';

export const isClient = () => typeof window === 'object';

export const isNumeric = (num: number | string) =>
  !isNaN(Number(num)) && isFinite(Number(num));

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const getLogger = async () => {
  if (isDev) {
    const consola = await import('consola');
    return consola.default;
  }

  return {
    log: noop,
    warn: noop,
    error: noop,
  };
};
