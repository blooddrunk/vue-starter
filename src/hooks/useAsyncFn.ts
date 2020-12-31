import { ref, Ref } from 'vue';

type ResultOfFnReturningPromise<T extends FnReturningPromise> = PromiseType<
  ReturnType<T>
> | null;

export const useAsyncFn = <T extends FnReturningPromise>(
  fn: T,
  initialData: ResultOfFnReturningPromise<T>
) => {
  const fnRef = ref<T>(fn);

  const isLoading = ref(false);
  const isCompleted = ref(false);
  const isSuccessful = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<ResultOfFnReturningPromise<T>>(
    initialData
  ) as Ref<ResultOfFnReturningPromise<T> | null>;

  let lastPromise;
  const request = async (...args: Parameters<T> | []) => {
    isLoading.value = true;
    isCompleted.value = false;
    isSuccessful.value = false;
    error.value = null;

    const promise = (lastPromise = fnRef.value(...args) as ReturnType<T>);

    try {
      const result = await promise;

      if (lastPromise === promise) {
        isSuccessful.value = true;
        data.value = result;

        return result;
      }
    } catch (error) {
      if (lastPromise === promise) {
        error.value = error;
        isSuccessful.value = false;
        console.error(error);
      }
    } finally {
      isLoading.value = false;
      isCompleted.value = true;
    }
  };

  return {
    isLoading,
    isCompleted,
    isSuccessful,
    error,
    data,
    request,
  };
};
