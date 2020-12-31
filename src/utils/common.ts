export const isClient = () => typeof window === 'object';

export const isNumeric = (num: number | string) =>
  !isNaN(Number(num)) && isFinite(Number(num));

export const convertToUnit = (
  str: string | number | null | undefined,
  unit = 'px'
): string | undefined => {
  if (str == null || str === '') {
    return undefined;
  } else if (isNumeric(str)) {
    return `${Number(str)}${unit}`;
  } else {
    return String(str);
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const jsonToUrlParams = (data: Record<string, any>) =>
  Object.entries(data).reduce((params, [key, value]) => {
    params.append(key, value);
    return params;
  }, new URLSearchParams());
