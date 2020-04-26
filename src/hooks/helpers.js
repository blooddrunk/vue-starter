import { ref, isRef, watchEffect } from 'vue';

export const wrap = (v) => (isRef(v) ? v : ref(v));

export const unwrap = (v) => (isRef(v) ? v.value : v);

export const watchUntil = (fn) =>
  new Promise((resolve) => {
    const cancel = watchEffect(() => {
      if (fn()) {
        cancel();
        resolve();
      }
    });
  });
