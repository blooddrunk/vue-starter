<template>
  <div>
    <ProductForm @submit="addProduct"></ProductForm>

    <SimpleList
      class="tw-mt-6"
      :items="products"
      :loading="isProductLoading"
      title-key="name"
    >
      <template #action="{ item }">
        <button class="button_normal" @click="removeProduct(item)">❌</button>
      </template>
    </SimpleList>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import ProductForm, { Product } from '@/components/ProductForm.vue';
import SimpleList from '@/components/SimpleList.vue';
import { useAxios } from '@/hooks/useAxios';
import axios from '@/utils/axios';

const useProduct = () => {
  const { data: products, isLoading: isProductLoading } = useAxios<Product[]>(
    {
      url: `${process.env.VUE_APP_JSON_SERVER_PATH}products`,
      __needValidation: false,
    },
    []
  );

  const addProduct = (value: Product) => {
    products.value.unshift(value);
  };

  const removeError = ref('');

  const removeProduct = async (target: Product) => {
    if (!target.id) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.VUE_APP_JSON_SERVER_PATH}products/${target.id}`,
        {
          __needValidation: false,
        }
      );

      products.value = products.value.filter(
        (product) => product.id !== target.id
      );
    } catch (error) {
      removeError.value = error.message;
      console.error(error);
    }
  };

  return {
    products,
    isProductLoading,
    addProduct,
    removeProduct,
  };
};

export default defineComponent({
  name: 'SimpleFormView',

  components: {
    ProductForm,
    SimpleList,
  },

  setup() {
    const {
      products,
      isProductLoading,
      addProduct,
      removeProduct,
    } = useProduct();

    return {
      products,
      isProductLoading,
      addProduct,
      removeProduct,
    };
  },
});
</script>
