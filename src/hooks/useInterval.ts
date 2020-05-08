import { ref, watchEffect } from 'vue';

export default (fn: Function, ms: number, { immediate = true } = {}) => {
  // TODO: to remain reactivity, ms has to be a ref
  // or ??
  const delayRef = ref(ms);

  let intervalID: number | null;

  const clear = () => {
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
    }
  };

  const set = () => {
    clear();

    intervalID = window.setInterval(fn, delayRef.value);
  };

  if (immediate) {
    set();
  }

  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      clear();
    });
  });

  return {
    set,
    clear,
  };
};
