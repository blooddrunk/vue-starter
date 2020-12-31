<template>
  <component :is="layoutComponent">
    <router-view></router-view>
  </component>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from './layouts/Default';
import EmptyLayout from './layouts/Empty';
import ErrorLayout from './layouts/Error';

// import { provideAxios } from '@/context/axios';

export default defineComponent({
  name: 'App',

  components: {
    DefaultLayout,
    EmptyLayout,
    ErrorLayout,
  },

  setup() {
    const route = useRoute();
    const layoutComponent = computed(
      () => `${route.meta.layout || 'Default'}Layout`
    );
    return {
      layoutComponent,
    };
  },
});
</script>
