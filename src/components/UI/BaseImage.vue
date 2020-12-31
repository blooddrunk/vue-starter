<script lang="ts">
// eslint-disable
import { defineComponent, h, computed, useCssModule, mergeProps } from 'vue';

const useAspectRatio = (aspectRatio?: number) => {
  if (aspectRatio) {
    return {
      paddingBottom: (1 / aspectRatio) * 100 + '%',
    };
  }

  return {};
};

export default defineComponent({
  name: 'BaseImage',

  props: {
    aspectRatio: {
      type: Number,
    },

    src: {
      type: String,
    },

    lazySrc: {
      type: String,
    },
  },

  setup(props, { attrs }) {
    const hasAspectRatio = computed(() => !!props.aspectRatio);

    return () => {
      if (hasAspectRatio.value) {
        const $style = useCssModule();

        return h(
          'div',
          {
            style: useAspectRatio(props.aspectRatio),
            class: $style.imageSizer,
          },
          h(
            'img',
            mergeProps(
              {
                src: props.src,
                class: $style.image,
              },
              attrs
            )
          )
        );
      }

      return h(
        'img',
        mergeProps(
          {
            src: props.src,
          },
          attrs
        )
      );
    };
  },
});
</script>

<style lang="postcss" module>
.imageSizer {
  @apply tw-relative;

  & .image {
    @apply tw-absolute tw-inset-0 tw-w-full tw-h-full;
  }
}
</style>
