import { ref, Ref } from 'vue';

export type AsyncFn<T = unknown, P extends unknown[] = unknown[]> = (
  ...args: P | []
) => Promise<T>;

export type AsyncFnOptions = Partial<{
  immediate: boolean;
  throwException: boolean;
}>;

export type UseAsyncFnReturn<
  Result = unknown,
  Args extends unknown[] = unknown[]
> = {
  isLoading: Ref<boolean>;
  isCompleted: Ref<boolean>;
  isSuccessful: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<Result | null>;
  request: (...args: Args | []) => Promise<void>;
};

export const useAsyncFn = <
  Result = unknown,
  Args extends unknown[] = unknown[]
>(
  fn: AsyncFn<Result, Args> | Ref<AsyncFn<Result, Args>>,
  initialData: Result | null = null,
  { immediate = false, throwException = false } = {}
): UseAsyncFnReturn<Result, Args> => {
  const fnRef = ref(fn);

  const isLoading = ref(false);
  const isCompleted = ref(false);
  const isSuccessful = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<Result | null>(initialData) as Ref<Result | null>;

  let lastPromise;
  const request = async (...args: Args | []) => {
    isLoading.value = true;
    isCompleted.value = false;
    isSuccessful.value = false;
    error.value = null;

    const promise = (lastPromise = fnRef.value(...args));

    try {
      const result = await promise;

      if (lastPromise === promise) {
        // FIXME: might related to https://github.com/vuejs/vue-next/pull/1129
        isSuccessful.value = true;
        data.value = result;
      }
    } catch (error) {
      if (lastPromise === promise) {
        error.value = error;
        isSuccessful.value = false;
        console.error(error);
      }

      if (throwException) {
        throw error;
      }
    } finally {
      isLoading.value = false;
      isCompleted.value = true;
    }
  };

  if (immediate) {
    request();
  }

  return {
    isLoading,
    isCompleted,
    isSuccessful,
    error,
    data,
    request,
  };
};
