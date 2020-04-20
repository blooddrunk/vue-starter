<template>
  <div :class="$style.pagination" class="tw-flex tw-py-3 tw-px-2">
    <a href="#" @click.prevent="pagination.first()">&Lt;</a>
    <a href="#" @click.prevent="pagination.prev()">&lt;</a>

    <div class="tw-flex-grow tw-text-center">
      {{ `${pagination.currentPage} / ${pagination.lastPage}` }}
    </div>

    <a href="#" @click.prevent="pagination.next()">&gt;</a>
    <a href="#" @click.prevent="pagination.last()">&Gt;</a>
  </div>
</template>

<script>
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

<style lang="scss" module>
.pagination {
  & > * {
    @apply tw-p-2;
  }
}
</style>
