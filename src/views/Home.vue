<template>
  <ul class="tw-list-none md:tw-w-1/2 tw-w-2/3 tw-m-auto tw-text-lg">
    <li
      v-for="item in menuList"
      class="tw-px-2 tw-py-3 tw-text-gray-800 tw-border-b"
      :key="item.text"
    >
      <router-link
        class="tw-flex tw-items-center tw-justify-between tw-cursor-pointer"
        :to="item.to"
      >
        {{ item.text }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  data: () => ({
    menuList: [
      {
        text: 'Counter',
        to: '/counter',
      },

      {
        text: 'Simple list',
        to: '/simple-list',
      },

      {
        text: 'Simple form',
        to: '/simple-form',
      },

      {
        text: 'Directive(Intersection Observer)',
        to: '/directive-intersection-observer',
      },

      {
        text: 'Lazy Image',
        to: '/lazy-image',
      },

      {
        text: 'Element UI',
        to: '/element-ui',
      },
    ],
  }),
};
</script>
