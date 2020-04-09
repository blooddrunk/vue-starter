import { reactive, toRefs } from 'vue';

export default (fn, initialData) => {
  const state = reactive({
    loading: false,
    error: null,
    data: initialData
  });

  let lastPromise;
  const fetch = async (...args) => {
    state.error = null;
    state.loading = true;

    const promise = (lastPromise = fn(...args));

    try {
      const result = await promise;
      if (lastPromise === promise) {
        state.result = result;
      }
    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    fetch
  };
};
