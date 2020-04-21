<template>
  <div>
    <h1 class="tw-text-semibold tw-text-xl">
      Enter Product
    </h1>

    <!-- <ValidationObserver> 
      <form></form>
    </ValidationObserver> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ValidationObserver } from 'vee-validate';

console.log(ValidationObserver);
export default defineComponent({
  name: 'ProductForm',

  components: {
    ValidationObserver,
  },

  setup() {},
});
</script>
