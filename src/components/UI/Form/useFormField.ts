import { useField } from 'vee-validate';
// import {
//   h,
//   defineComponent,
//   resolveComponent,
//   resolveDynamicComponent,
//   ComponentOptions,
//   VNodeArrayChildren,
// } from 'vue';

export const useSharedProps = () =>
  ({
    name: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      default: '',
    },

    labelWidth: {
      type: String,
      default: undefined,
    },

    // only has a visual effect
    required: {
      type: Boolean,
      default: false,
    },
  } as const);

export const useFormField = (name: string, label: string) => {
  const { value, errorMessage, handleBlur, handleChange, meta } = useField(
    name,
    undefined,
    {
      label,
    }
  );

  return {
    handleChange,
    handleBlur,
    errorMessage,
    value,
    meta,
  };
};

// export const createFormField = (
//   component: string,
//   componentProps?: Record<string, any> | null,
//   children?: VNodeArrayChildren
// ) => {
//   return () => {
//     const

//     return h(
//       resolveDynamicComponent(component) as ComponentOptions,
//       componentProps,
//       children
//     )
//   };
// };
