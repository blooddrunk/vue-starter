declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

declare type FnReturningPromise = (...args: unknown[]) => Promise<unknown>;

declare type PromiseType<P extends Promise<unknown>> = P extends Promise<
  infer T
>
  ? T
  : never;

declare const __DEV__: boolean;
