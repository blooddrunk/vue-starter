<template>
  <BaseLoading :loading="loading">
    <transition-group
      tag="ul"
      enter-active-class="animate__animated animate__fadeInUp animate__faster"
      leave-active-class="animate__animated animate__fadeOutRight animate__faster"
    >
      <li v-for="item in items" :key="item[itemKey]">
        <div
          class="tw-flex tw-items-center tw-border-b-thin tw-border-gray-500"
        >
          <a
            v-if="item.url"
            class="tw-flex-grow tw-block tw-p-2 tw-transition tw-duration-500 tw-transform hover:tw--translate-y-1 hover:tw-text-blue-700"
            :href="item.url"
            target="_blank"
          >
            {{ item[titleKey] }}
          </a>
          <div v-else class="tw-flex-grow tw-p-2">
            {{ item[titleKey] }}
          </div>

          <div>
            <slot name="action" :item="item"></slot>
          </div>
        </div>
      </li>
    </transition-group>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BaseLoading from '@/components/UI/BaseLoading.vue';

export default defineComponent({
  name: 'SimpleList',

  components: {
    BaseLoading,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },

    itemKey: {
      type: String,
      default: 'id',
    },

    titleKey: {
      type: String,
      default: 'title',
    },
  },
});
</script>
