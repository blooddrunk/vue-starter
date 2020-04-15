import { watchEffect } from 'vue';

import { wrap } from './helpers';

export default (fn, ms, { immediate = false } = {}) => {
  // TODO: to remain reactivity, ms has to be a ref
  // or ??
  const delayRef = wrap(ms);

  let intervalID;

  const clear = () => {
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
    }
  };

  const set = () => {
    clear();

    intervalID = setInterval(fn, delayRef.value);
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
