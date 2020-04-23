<template>
  <div class="tw-p-3 tw-shadow-md">
    <h1 class="tw-py-2 tw-text-semibold tw-text-xl">
      Enter Product
    </h1>

    <form @submit.prevent="handleSubmit" @reset.prevent="handleReset">
      <BaseTextInput
        v-model="product.name"
        name="name"
        label="Product Name"
        placeholder="Please enter product name"
      ></BaseTextInput>

      <BaseTextInput
        v-model="product.price"
        name="price"
        label="Product Price"
        type="number"
      ></BaseTextInput>

      <BaseTextInput
        v-model="product.inventory"
        name="invetory"
        label="Product Inventory"
        type="number"
      ></BaseTextInput>

      <div class="tw-flex tw-items-center tw-justify-end tw-p-3">
        <transition
          enter-active-class="animated jello"
          leave-active-class="animated fadeOut"
        >
          <div
            v-if="message"
            :class="[
              'tw-mr-2',
              error ? 'tw-text-red-500' : 'tw-text-green-400',
            ]"
          >
            {{ message }}
          </div>
        </transition>

        <button class="button_primary" type="submit">Submit</button>
        <button class="button_normal" type="reset">Reset</button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue';

import BaseTextInput from '@/components/UI/BaseTextInput';
import useAsync from '@/hooks/useAsync';
import useTimeout from '@/hooks/useTimeout';

export default defineComponent({
  name: 'ProductForm',

  components: {
    BaseTextInput,
  },

  emits: {
    submit: Object,
  },

  setup(props, { emit }) {
    const product = reactive({
      name: null,
      price: null,
      inventory: null,
    });

    const { data, error, fetchData } = useAsync(
      {
        url: `${process.env.VUE_APP_JSON_SERVER_PATH}products`,
        method: 'post',
        data: product,
        __needValidation: false,
      },
      {}
    );

    const handleSubmit = () => {
      fetchData();
    };

    const handleReset = () => {
      product.name = null;
      product.price = null;
      product.inventory = null;
    };

    const message = ref('');
    watch([data, error], () => {
      if (error.value) {
        message.value = 'Failed to create product';
      } else {
        message.value = 'Product created';
        handleReset();
        emit('submit', data.value);
      }

      useTimeout(() => {
        message.value = '';
      }, 2000);
    });

    return { product, handleSubmit, handleReset, message, error };
  },
});
</script>
