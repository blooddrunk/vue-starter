import { onMounted, onBeforeUnmount } from 'vue';

import { unwrap } from './helpers';

export default (target, type, handler, options) => {
  onMounted(() => {
    const t = unwrap(target);

    t.addEventListener(type, handler, options);
  });

  onBeforeUnmount(() => {
    const t = unwrap(target);

    t.removeEventListener(type, handler, options);
  });
};
