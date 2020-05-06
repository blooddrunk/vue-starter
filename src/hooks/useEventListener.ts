import { ref, onMounted, onBeforeUnmount } from 'vue';

export default (target, type, handler, options) => {
  const targetRef = ref(target);

  onMounted(() => {
    targetRef.value.addEventListener(type, handler, options);
  });

  onBeforeUnmount(() => {
    targetRef.value.removeEventListener(type, handler, options);
  });
};
