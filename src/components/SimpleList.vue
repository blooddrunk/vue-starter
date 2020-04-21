<template>
  <BaseLoading :loading="loading">
    <ul>
      <li v-for="item in items" :key="item[itemKey]">
        <div class="tw-p-2 tw-border-b tw-border-gray-500 tw-text-gray-800">
          <a
            v-if="item.url"
            class="tw-block tw-transition tw-duration-500 tw-transform hover:tw--translate-y-1 hover:tw-text-blue-700"
            :href="item.url"
            target="_blank"
          >
            {{ item[titleKey] }}
          </a>
          <div v-else>
            {{ item[titleKey] }}
          </div>
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

    titleKey: {
      type: String,
      default: 'title',
    },
  },

  setup() {
    const getItemComponent = (item) => {
      if (item.url) {
        return 'a';
      }

      return 'div';
    };

    // FIXME: vue-next doesn't support jsx yet
    return {
      getItemComponent,
    };
  },
});
</script>
