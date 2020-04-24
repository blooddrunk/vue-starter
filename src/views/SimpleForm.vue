<template>
  <div>
    <ProductForm @submit="handleSubmit"></ProductForm>
    <SimpleList
      class="tw-mt-6"
      :items="items"
      :loading="isLoading"
      title-key="name"
    >
      <template #action="{ item }">
        <button class="button_normal" @click="handleRemove(item)">❌</button>
      </template>
    </SimpleList>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import ProductForm from '@/components/ProductForm';
import SimpleList from '@/components/SimpleList';
import useAsync from '@/hooks/useAsync';

export default defineComponent({
  name: 'SimpleFormView',

  components: {
    ProductForm,
    SimpleList,
  },

  setup() {
    const { data: items, isLoading, request } = useAsync(
      {
        url: `${process.env.VUE_APP_JSON_SERVER_PATH}products`,
        __needValidation: false,
        immediate: true,
      },
      []
    );

    const handleSubmit = (value) => {
      items.value.unshift(value);
    };

    const handleRemove = (item) => {
      useAsync(
        {
          url: `${process.env.VUE_APP_JSON_SERVER_PATH}products/${item.id}`,
          method: 'delete',
          __needValidation: false,
          immediate: true,
        },
        []
      );
    };

    return {
      items,
      isLoading,
      request,
      handleSubmit,
      handleRemove,
    };
  },
});
</script>
