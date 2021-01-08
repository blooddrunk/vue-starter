<template>
  <div class="tw-p-3 tw-shadow-md">
    <h1 class="tw-py-2 tw-text-semibold tw-text-xl">Enter Product</h1>

    <Form
      as="el-form"
      :validation-schema="validationSchema"
      @submit="onSubmit"
      #default="{ isSubmitting, meta }"
    >
      <ElementInput
        name="name"
        label="Product Name"
        required
        placeholder="Please Enter Product Name"
      ></ElementInput>

      <!-- <BaseTextInput
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
      ></BaseTextInput> -->

      <div class="tw-flex tw-items-center tw-justify-end tw-p-3">
        <!-- <transition
          enter-active-class="animate__animated animate__jello"
          leave-active-class="animate__animated animate__fadeOut"
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
        </transition> -->

        <button
          class="button_primary"
          type="submit"
          :disabled="!meta.valid || isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
        <button class="button_normal" type="reset">Reset</button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Form, FormActions } from 'vee-validate';

import axios from '@/utils/axios';
import ElementInput from '@/components/UI/Form/ElementInput.ts';

export type Product = {
  id?: string | number;
  name?: string | null;
  price?: number | null;
  inventory?: number | null;
};

const useSubmit = (product: Product) =>
  axios.request<Product>({
    url: `${process.env.VUE_APP_JSON_SERVER_PATH}products`,
    method: 'post',
    data: product,
    __needValidation: false,
  });

export default defineComponent({
  name: 'ProductForm',

  components: {
    Form,
    ElementInput,
  },

  emits: {
    submit: null,
  },

  setup(props, { emit }) {
    const validationSchema = {
      name: 'required',
      price: 'required',
      inventory: 'required',
    };

    const onSubmit = async (values: Product, actions: FormActions<Product>) => {
      const { data } = await useSubmit(values);
      emit('submit', data);
      actions.resetForm();
    };

    // const message = ref('');
    // watch(isCompleted, (value) => {
    //   if (!value) {
    //     return;
    //   }

    //   if (error.value) {
    //     message.value = 'Failed to create product';
    //   } else {
    //     message.value = 'Product created';
    //     onReset();
    //     emit('submit', data.value);
    //   }

    //   useTimeout(() => {
    //     message.value = '';
    //   }, 3000);
    // });

    return {
      validationSchema,
      onSubmit,
    };
  },
});
</script>
