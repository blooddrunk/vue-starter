import { reactive, toRefs } from 'vue';

export default (
  fn,
  initialData = null,
  { immediate = false, throwException = false } = {}
) => {
  const state = reactive({
    isLoading: false,
    error: null,
    data: initialData,
  });

  let lastPromise;
  const fetchData = async (...args) => {
    state.error = null;
    state.isLoading = true;

    const promise = (lastPromise = fn(...args));

    try {
      const result = await promise;

      if (lastPromise === promise) {
        state.data = result;
      }
    } catch (error) {
      if (lastPromise === promise) {
        state.error = error;
        console.error(error);
      }

      if (throwException) {
        throw error;
      }
    } finally {
      state.isLoading = false;
    }
  };

  if (immediate) {
    fetchData();
  }

  return {
    ...toRefs(state),
    fetchData,
  };
};
