<template>
  <ul class="tw-list-none tw-w-1/2 tw-m-auto tw-text-lg">
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

<script>
export default {
  data: () => ({
    menuList: [
      {
        text: 'Simple list',
        to: '/simple-list',
      },
    ],
  }),
};
</script>
