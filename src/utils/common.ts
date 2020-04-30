export const isClient = () => typeof window === 'object';

export const isProd = () =>
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'; // Production here is a concept, not a value, for you it might include staging

export const isDev = () => process.env.NODE_ENV === 'development';

export const isNumeric = (num: number | string) =>
  !isNaN(Number(num)) && isFinite(Number(num));

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
