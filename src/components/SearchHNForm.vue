<template>
  <form class="tw-w-full">
    <div class="tw-flex tw-flex-wrap tw-items-center tw-py-3">
      <div class="tw-flex-grow tw-max-w-xs">
        <input
          type="text"
          class="input"
          :value="query"
          @input="onQueryChange"
        />
      </div>
      <div class="tw-ml-2">
        <button class="button_primary" type="submit">Search</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchHNForm',

  props: {
    query: {
      type: String,
      required: true,
    },

    onQueryChange: {
      type: Function,
      required: true,
    },
  },
});
</script>
