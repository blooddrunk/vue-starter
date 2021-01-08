<template>
  <el-form-item
    :label="label"
    :label-width="labelWidth"
    :required="required"
    :error="errorMessage"
  >
    <el-input
      :name="name"
      :model-value="value"
      @update:model-value="handleChange"
      @blur="handleBlur"
      v-bind="$attrs"
    >
    </el-input>
  </el-form-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSharedProps, useFormField } from './useFormField';

export default defineComponent({
  name: 'ElementInput',

  props: {
    ...useSharedProps(),
  },

  setup(props) {
    const { handleChange, handleBlur, errorMessage, value } = useFormField(
      props.name,
      props.label
    );

    return {
      handleChange,
      handleBlur,
      errorMessage,
      value,
    };
  },
});
</script>
