<template>
  <component :is="layoutComponent">
    <router-view></router-view>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from './layouts/Default.vue';
import EmptyLayout from './layouts/Empty.vue';
import ErrorLayout from './layouts/Error.vue';

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
