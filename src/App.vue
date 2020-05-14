<template>
  <component :is="layoutComponent">
    <router-view></router-view>
  </component>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from './layouts/Default';

// import { provideAxios } from '@/context/axios';

export default defineComponent({
  name: 'App',

  components: {
    DefaultLayout,
  },

  setup() {
    const route = useRoute();
    const layoutComponent = computed(
      () => route.meta.layout || 'DefaultLayout'
    );
    return {
      layoutComponent,
    };
  },
});
</script>
