import { ref, watchEffect } from 'vue';

export default (fn, ms, { immediate = false } = {}) => {
  const isReady = ref(false);
  let timeoutID;

  const set = () => {
    isReady.value = false;
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      isReady.value = true;
      fn();
    }, ms);
  };

  const clear = () => {
    isReady.value = false;
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  };

  watchEffect((onInvalidate) => {
    if (immediate) {
      set();
    }

    onInvalidate(clear);
  });

  return {
    isReady,
    set,
    clear,
  };
};
