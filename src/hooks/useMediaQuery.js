import { ref, onMounted, onUnmounted } from 'vue';

import { isClient } from './helpers';

export default (query) => {
  let mql;

  if (isClient()) {
    mql = window.matchMedia(query);
  }

  const matches = ref(mql ? mql.matches : false);
  const handler = (event) => {
    mql.value = event.matches;
  };

  onMounted(() => {
    if (!mql) {
      mql = window.matchMedia(query);
    }

    mql.value = mql.matches;
    mql.addListener(handler);
  });

  onUnmounted(() => {
    mql.removeListener(handler);
  });

  return matches;
};
