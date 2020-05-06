import { reactive, toRefs, ref } from 'vue';
import type { Ref, ToRefs, UnwrapRef } from 'vue';

export type AsyncState<T> = {
  isLoading: boolean;
  isCompleted: boolean;
  isSuccessful: boolean;
  error?: Error | null;
  data?: T | null;
};

export type AsyncFn<T = any, Args extends any[] = any[]> = (
  ...args: Args | []
) => Promise<T>;

export type AsyncFnOptions = Partial<{
  immediate: boolean;
  throwException: boolean;
}>;

export type AsyncFnReturn<T> = ToRefs<AsyncState<T>> & {
  request: (...args: any[] | []) => Promise<void>;
};

export default <Result = any, Args extends any[] = any[]>(
  fn: AsyncFn<Result, Args> | Ref<AsyncFn<Result, Args>>,
  initialData: Result | null = null,
  { immediate = false, throwException = false } = {}
): AsyncFnReturn<Result> => {
  const fnRef = ref(fn);

  const state = reactive<AsyncState<Result>>({
    isLoading: false,
    isCompleted: false,
    isSuccessful: false,
    error: null,
    data: initialData,
  });

  let lastPromise;
  const request = async (...args: Args | []) => {
    state.error = null;
    state.isCompleted = false;
    state.isSuccessful = false;
    state.isLoading = true;

    const promise = (lastPromise = fnRef.value(...args));

    try {
      const result = await promise;

      if (lastPromise === promise) {
        // FIXME: might related to https://github.com/vuejs/vue-next/pull/1129
        state.data = result as UnwrapRef<Result>;
        state.isSuccessful = true;
      }
    } catch (error) {
      if (lastPromise === promise) {
        state.error = error;
        state.isSuccessful = false;
        console.error(error);
      }

      if (throwException) {
        throw error;
      }
    } finally {
      state.isCompleted = true;
      state.isLoading = false;
    }
  };

  if (immediate) {
    request();
  }

  return {
    ...toRefs(state),
    request,
  };
};
