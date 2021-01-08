import { defineComponent, h, resolveComponent, computed } from 'vue';
import pick from 'lodash/pick';

import { useSharedProps, useFormField } from './useFormField';

export default defineComponent({
  name: 'ElementInput',

  props: {
    ...useSharedProps(),
  },

  setup(props, { attrs }) {
    const { handleChange, handleBlur, errorMessage, value } = useFormField(
      props.name,
      props.label
    );

    const formItemProps = computed(() => ({
      error: errorMessage.value,
      ...pick(props, ['label', 'labelWidth', 'required']),
    }));

    const formFieldProps = computed(() => ({
      name: props.name,
      modelValue: value,
      onUpdateModelValue: handleChange,
      onBlur: handleBlur,
      ...attrs,
    }));

    return () => {
      return h(
        resolveComponent('ElFormItem'),
        formItemProps,
        h(resolveComponent('ElInput'), formFieldProps)
      );
    };
  },
});
