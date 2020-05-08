<template>
  <div :class="$style.input">
    <div :class="{ [$style.control]: true, [$style.controlActive]: isFocused }">
      <label
        :class="{ [$style.labelActive]: isLabelActive }"
        @click="input.focus()"
        :for="name"
      >
        <slot name="label">
          <span>{{ label }}</span>
        </slot>
      </label>

      <input
        ref="input"
        :id="name"
        v-model="innerValue"
        :type="type"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <span></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, watchEffect } from 'vue';

type InputType =
  | 'url'
  | 'text'
  | 'password'
  | 'tel'
  | 'search'
  | 'number'
  | 'email';

export default defineComponent({
  name: 'BaseTextInput',

  props: {
    vid: {
      type: String,
      default: undefined,
    },

    name: {
      type: String,
      default: '',
    },

    label: {
      type: String,
      default: '',
    },

    rules: {
      type: [Object, String],
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    type: {
      type: String as () => InputType,
      default: 'text',
    },

    modelValue: {
      type: [String, Number],
      default: '',
    },
  },

  emits: {
    focus: null,
    blur: null,
    'update:modelValue': null,
  },

  setup(props, { emit, slots }) {
    const input = ref(null);
    const hasLabel = computed(() => !!(slots.label || props.label));

    const isFocused = ref(false);
    const handleFocus = () => {
      isFocused.value = true;
      emit('focus');
    };
    const handleBlur = () => {
      isFocused.value = false;
      emit('blur');
    };

    const innerValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      (value, oldValue) => {
        if (value !== oldValue) {
          innerValue.value = value;
        }
      }
    );
    watchEffect(() => {
      emit('update:modelValue', innerValue.value);
    });

    const isDirty = computed(
      () =>
        innerValue.value !== null &&
        innerValue.value !== undefined &&
        innerValue.value.toString().length > 0
    );
    const isLabelActive = computed(
      () => isFocused.value || isDirty.value || props.placeholder
    );

    return {
      input,
      hasLabel,
      isFocused,
      handleFocus,
      handleBlur,
      innerValue,
      isLabelActive,
    };
  },
});
</script>

<style lang="scss" module>
.input {
  @apply tw-flex tw-max-w-full tw-pt-5;

  .control {
    @apply tw-relative tw-flex tw-flex-grow tw-items-center tw-mb-1;

    &:hover {
      @apply tw-border-gray-800;
    }

    &::before,
    &::after {
      content: '';
      @apply tw-absolute tw-inset-x-0 tw-bottom-0;
      @apply tw-transition tw-duration-300 tw-ease-out;
    }

    &::before {
      @apply tw-border-t-thin tw-border-solid tw-border-inherit;
    }

    &::after {
      @apply tw-border-t-thin tw-border-b-thin;
      @apply tw-border-current tw-border-solid;
      transform: scaleX(0);
    }
  }

  .controlActive {
    &::after {
      transform: scaleX(1);
    }
  }

  label {
    @apply tw-absolute tw-left-0;
    @apply tw-h-6 tw-ml-2;
    @apply tw-transition tw-origin-top-left tw-duration-500 tw-ease-in-out;
    @apply tw-leading-6;
  }

  .labelActive {
    transform: translateY(-1.5rem) scale(0.75);
  }

  input {
    @apply tw-flex-grow;
    @apply tw-w-full tw-p-2;
    @apply tw-appearance-none tw-bg-transparent tw-leading-normal;

    &::placeholder {
      @apply tw-text-gray-600;
    }

    &:focus {
      @apply tw-outline-none;
    }
  }
}
</style>
