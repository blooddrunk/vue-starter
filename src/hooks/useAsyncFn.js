import { reactive, toRefs } from 'vue';

export default (
  fn,
  initialData = null,
  { immediate = false, throwException = false } = {}
) => {
  const state = reactive({
    isLoading: false,
    isCompleted: false,
    isSuccessful: false,
    error: null,
    data: initialData,
  });

  let lastPromise;
  const request = async (...args) => {
    state.error = null;
    state.isCompleted = false;
    state.isSuccessful = false;
    state.isLoading = true;

    const promise = (lastPromise = fn(...args));

    try {
      const result = await promise;

      if (lastPromise === promise) {
        state.data = result;
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
