<template>
  <section>
    <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
      <div
        class="tw-w-6 tw-h-6 tw-transition-all tw-duration-1000 tw-ease-in-out"
        :class="
          isBoxIntersecting
            ? 'tw-rounded-full tw-bg-pink-300 tw-shadow'
            : 'tw-bg-green-300'
        "
      ></div>
      <transition
        enter-active-class="animate__animated animate__rubberBand"
        leave-active-class="animate__animated animate__backOutDown"
      >
        <p v-if="isBoxIntersecting">Intersecting</p>
      </transition>
    </div>

    <div
      ref="scrollContainer"
      class="tw-mt-6 tw-overflow-y-auto"
      style="max-height: 20rem"
    >
      <div class="tw-h-screen tw-flex tw-justify-center tw-items-end tw-p-6">
        <div
          class="tw-w-40 tw-h-40 tw-p-6 tw-border-4 tw-border-blue-500 tw-border-opacity-75"
          v-intersect="intersect"
        ></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DirectiveIntersectionObserver',

  setup() {
    const scrollContainer = ref(null);

    const isBoxIntersecting = ref(false);
    const handleIntersect = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
      isIntersecting: boolean
    ) => {
      isBoxIntersecting.value = isIntersecting;
    };

    const intersect = {
      handler: handleIntersect,
      options: {
        root: scrollContainer,
        // threshold: [0, 0.5, 1.0],
      },
    };
    return {
      isBoxIntersecting,
      intersect,
    };
  },
});
</script>
