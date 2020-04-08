<template>
  <div>
    <div v-if="listState.loading">Loading...</div>
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
      default: () => []
    },

    itemKey: {
      type: String,
      default: 'objectID'
    }
  }
};
</script>
