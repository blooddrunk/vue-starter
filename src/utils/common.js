const isDev = process.env.NODE_ENV === 'development';

export const isClient = () => typeof window === 'object';

export const isNumeric = (num) => !isNaN(num) && isFinite(num);

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
