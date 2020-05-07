<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-if="loading" key="loading">
      {{ text }}
    </div>
    <div v-else key="content">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseLoading',

  props: {
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, .9)',
    },

    loading: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: 'Loading...',
    },
  },
});
</script>
