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
      <button class="button_primary" @click="resetCounter1">
        Reset
      </button>
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

      <button class="button_primary" @click="start">
        Start
      </button>
      <button class="button_primary" @click="stop">
        Stop
      </button>
      <button class="button_primary" @click="resetCounter2">
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';

import useTimeout from '@/hooks/useTimeout';
import useInterval from '@/hooks/useInterval';

export default defineComponent({
  name: 'CounterView',

  setup() {
    const counter1 = ref(0);
    const delay1 = ref(1);

    const delay1InMilliseconds = computed(() => delay1.value * 1000 || 1000);

    const { set: increamentAsync } = useTimeout(
      () => {
        ++counter1.value;
      },
      delay1InMilliseconds,
      { immediate: false }
    );

    const resetCounter1 = () => {
      counter1.value = 0;
      delay1.value = 1;
    };

    const counter2 = ref(0);
    const delay2 = ref(1);

    const delay2InMilliseconds = computed(() => delay2.value * 1000 || 1000);

    const { set: start, clear: stop } = useInterval(
      () => {
        ++counter2.value;
      },
      delay2InMilliseconds,
      { immediate: false }
    );

    const resetCounter2 = () => {
      stop();
      counter2.value = 0;
      delay2.value = 1;
    };

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

<style lang="scss" module>
.title {
  @apply tw-py-3 tw-text-lg tw-font-bold tw-text-gray-700;
}
</style>
