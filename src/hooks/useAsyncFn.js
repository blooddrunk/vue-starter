import { reactive, toRefs } from 'vue';

export default (fn, initialData = null) => {
  const state = reactive({
    loading: false,
    error: null,
    data: initialData,
  });

  let lastPromise;
  const fetchData = async (...args) => {
    state.error = null;
    state.loading = true;

    try {
      const promise = (lastPromise = fn(...args));

      const result = await promise;

      if (lastPromise === promise) {
        state.data = result;
      }
    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    fetchData,
  };
};
