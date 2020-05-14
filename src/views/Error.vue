<template>
  <section
    class="tw-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center"
  >
    <h3 class="tw-text-5xl tw-font-bold tw-py-6">{{ title }}</h3>
    <p class="tw-mt-6">
      <router-link to="/">
        返回首页
      </router-link>
    </p>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFound',

  props: {
    fullscreen: {
      type: Boolean,
      default: true,
    },

    title: {
      type: String,
      default: '404 NOT FOUND',
    },
  },
});
</script>
