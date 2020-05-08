import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';

export default <T extends EventTarget, E extends Event>(
  target: T | Ref<T>,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
) => {
  const targetRef = ref(target);

  onMounted(() => {
    targetRef.value.addEventListener(type, handler, options);
  });

  onBeforeUnmount(() => {
    targetRef.value.removeEventListener(type, handler, options);
  });
};
