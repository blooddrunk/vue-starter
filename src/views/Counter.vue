<template>
  <div>
    <div>
      <div :class="$style.title">Counter 1: {{ counter1 }}</div>

      <div class="tw-py-3">
        <input
          class="input"
          type="text"
          v-model="delay1"
          placeholder="Delay(s)"
        />
      </div>

      <button class="button_primary" @click="increamentAsync">
        Increment Async
      </button>
      <button class="button_primary" @click="resetCounter1">Reset</button>
    </div>

    <div class="tw-mt-3">
      <div :class="$style.title">Counter 2: {{ counter2 }}</div>

      <div class="tw-py-3">
        <input
          class="input"
          type="text"
          v-model="delay2"
          placeholder="Delay(s)"
        />
      </div>

      <button class="button_primary" @click="start">Start</button>
      <button class="button_primary" @click="stop">Stop</button>
      <button class="button_primary" @click="resetCounter2">Reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import { useTimeout } from '@/hooks/useTimeout';
import { useInterval } from '@/hooks/useInterval';

const useCounter1 = () => {
  const counter = ref(0);
  const delay = ref(1);

  const delayInMilliseconds = computed(() => delay.value * 1000 || 1000);

  const { set: increamentAsync } = useTimeout(
    () => {
      ++counter.value;
    },
    delayInMilliseconds,
    { immediate: false }
  );

  const resetCounter = () => {
    counter.value = 0;
    delay.value = 1;
  };

  return {
    counter,
    delay,
    resetCounter,
    increamentAsync,
  };
};

const useCounter2 = () => {
  const counter = ref(0);
  const delay = ref(1);

  const delayInMilliseconds = computed(() => delay.value * 1000 || 1000);

  const { set: start, clear: stop } = useInterval(
    () => {
      ++counter.value;
    },
    delayInMilliseconds,
    { immediate: false }
  );

  const resetCounter = () => {
    stop();
    counter.value = 0;
    delay.value = 1;
  };

  return {
    counter,
    delay,
    resetCounter,
    start,
    stop,
  };
};

export default defineComponent({
  name: 'CounterView',

  setup() {
    const {
      counter: counter1,
      delay: delay1,
      resetCounter: resetCounter1,
      increamentAsync,
    } = useCounter1();
    const {
      counter: counter2,
      delay: delay2,
      resetCounter: resetCounter2,
      start,
      stop,
    } = useCounter2();

    return {
      counter1,
      delay1,
      increamentAsync,
      resetCounter1,
      counter2,
      delay2,
      start,
      stop,
      resetCounter2,
    };
  },
});
</script>

<style module>
.title {
  @apply tw-py-3 tw-text-lg tw-font-bold tw-text-gray-700;
}
</style>
