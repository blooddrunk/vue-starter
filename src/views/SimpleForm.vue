<template>
  <div>
    <ProductForm></ProductForm>
    <SimpleList
      :items="items"
      :loading="isLoading"
      title-key="name"
    ></SimpleList>
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
    const { data: items, isLoading, fetchData } = useAsync(
      {
        // 'https://my-json-server.typicode.com/blooddrunk/my-json-server/products'
        url: '/json/products',
        __needValidation: false,
        immediate: true,
      },
      []
    );

    return {
      items,
      isLoading,
      fetchData,
    };
  },
});
</script>
