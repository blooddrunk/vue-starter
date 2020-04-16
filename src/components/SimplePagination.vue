<template>
  <div class="tw-flex tw-py-3 tw-px-2">
    <a href="#" @click.prevent="pagination.first()">&Lt;</a>
    <a href="#" @click.prevent="pagination.prev()">&lt;</a>

    <div class="tw-flex-grow tw-px-3 tw-text-center">
      {{ `${pagination.page} / ${pagination.lastPage}` }}
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
