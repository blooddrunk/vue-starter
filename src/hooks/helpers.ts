import { watchEffect } from 'vue';

export const watchUntil = (fn: () => boolean): Promise<void> =>
  new Promise((resolve) => {
    const cancel = watchEffect(() => {
      if (fn()) {
        cancel();
        resolve();
      }
    });
  });
