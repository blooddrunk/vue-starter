<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, .9)',
    },

    loading: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: 'Loading...',
    },
  },

  setup(props, { slots }) {
    return () => {
      return <div>{slots.default()}</div>;
    };
  },
});
</script>
