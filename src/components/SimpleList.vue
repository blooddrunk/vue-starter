<template>
  <div>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="item in items" :key="item[itemKey]">
        <a class="hover:tw-underline" :href="item.url" target="_blank">
          {{ item.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SimpleList',

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
      default: 'objectID',
    },
  },
};
</script>
