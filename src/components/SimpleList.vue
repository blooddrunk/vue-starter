<template>
  <BaseLoading :loading="loading">
    <ul>
      <li v-for="item in items" :key="item[itemKey]">
        <div class="tw-p-2 tw-border-b tw-border-gray-500 tw-text-gray-800">
          {{ item.title }}
        </div>
      </li>
    </ul>
  </BaseLoading>
</template>

<script>
import { defineComponent } from 'vue';

import BaseLoading from '@/components/UI/BaseLoading';

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
  },
});
</script>
