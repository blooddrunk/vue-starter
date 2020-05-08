export const isClient = () => typeof window === 'object';

export const isNumeric = (num: number | string) =>
  !isNaN(Number(num)) && isFinite(Number(num));

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
