<template>
  <div class="tw-flex">
    <div class="tw-w-64 tw-mx-auto">
      <h3 class="tw-p-3">aspect ratio = 1</h3>

      <BaseImage
        v-for="imageUrl in imageList"
        :key="imageUrl"
        class="tw-mb-3"
        :aspect-ratio="1"
        :src="imageUrl"
      ></BaseImage>
    </div>
    <div class="tw-w-64 tw-mx-auto">
      <h3 class="tw-p-3">original</h3>

      <BaseImage
        v-for="imageUrl in imageList"
        :key="imageUrl"
        class="tw-mb-3"
        :src="imageUrl"
      ></BaseImage>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BaseImage from '@/components/UI/BaseImage.vue';

export default defineComponent({
  name: 'LazyImage',

  components: {
    BaseImage,
  },

  setup() {
    const imageList = [...Array(10).keys()].map(
      (index) =>
        `https://ik.imagekit.io/demo/img/image${index + 1}.jpeg?tr=w-400,h-300`
    );

    return {
      imageList,
    };
  },
});
</script>
