<template>
  <div :class="$style.pagination" class="tw-flex tw-py-3 tw-px-2">
    <a
      :class="{ disabled: pagination.isFirst.value }"
      href="#"
      @click.prevent="pagination.first()"
    >
      &Lt;
    </a>
    <a
      :class="{ disabled: pagination.isFirst.value }"
      href="#"
      @click.prevent="pagination.prev()"
    >
      &lt;
    </a>

    <div class="tw-flex-grow tw-text-center">
      <span class="tw-text-blue-400">{{ pagination.currentPage.value }}</span>
      /
      <span>{{ pagination.lastPage.value }}</span>
    </div>

    <a
      :class="{ disabled: pagination.isLast.value }"
      href="#"
      @click.prevent="pagination.next()"
    >
      &gt;
    </a>
    <a
      :class="{ disabled: pagination.isLast.value }"
      href="#"
      @click.prevent="pagination.last()"
    >
      &Gt;
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SimplePagination',

  props: {
    pagination: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="postcss" module>
.pagination {
  & > * {
    @apply tw-p-2;
  }

  & :global(a.disabled) {
    @apply tw-text-gray-500 tw-cursor-not-allowed;
  }
}
</style>
