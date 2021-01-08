import { Ref } from 'vue';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type FnReturningPromise = (...args: any[]) => Promise<any>;

export type PromiseType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : never;

export type Refable<T> = Ref<T> | T;
