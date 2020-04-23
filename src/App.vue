<template>
  <main class="tw-min-h-screen tw-p-6">
    <section class="tw-flex tw-flex-col tw-items-center tw-pt-20">
      <router-link to="/">
        <h2 class="tw-py-5 tw-text-3xl tw-text-indigo-500 tw-font-bold">
          Vue 3
        </h2>
      </router-link>

      <div class="tw-container">
        <router-view></router-view>
      </div>
    </section>
  </main>
</template>

<script>
import { defineComponent } from 'vue';

// import { provideAxios } from '@/context/axios';

export default defineComponent({
  name: 'App',

  setup() {
    // provideAxios();
  },
});
</script>
