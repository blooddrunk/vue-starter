import { ref, watchEffect } from 'vue';

import { wrap } from './helpers';

export default (fn, ms, { immediate = true } = {}) => {
  const isReady = ref(false);

  // TODO: to remain reactivity, ms has to be a ref
  // or ??
  const delayRef = wrap(ms);

  let timeoutID = null;

  const clear = () => {
    isReady.value = false;
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = null;
    }
  };

  const set = () => {
    clear();

    timeoutID = setTimeout(() => {
      isReady.value = true;
      fn();
    }, delayRef.value);
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
    isReady,
    set,
    clear,
  };
};
