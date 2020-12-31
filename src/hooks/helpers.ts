import { watchEffect, watch } from 'vue';

export const watchUntil = (cb: () => boolean): Promise<void> =>
  new Promise((resolve) => {
    const stop = watchEffect(() => {
      if (cb()) {
        resolve();
        stop();
      }
    });
  });

export const waitForValue = <T = any>(cb: () => T): Promise<T> =>
  new Promise((resolve) => {
    const stop = watch(
      cb,
      (value) => {
        if (value !== undefined && value !== null) {
          resolve(value);
          stop && stop();
        }
      },
      { immediate: true }
    );
  });
