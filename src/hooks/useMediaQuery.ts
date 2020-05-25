import { ref, onMounted, onUnmounted, Ref } from 'vue';

export const useMediaQuery = (query: string): Ref<boolean> => {
  let mql = window.matchMedia(query);

  const matches = ref(mql ? mql.matches : false);
  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };

  onMounted(() => {
    if (!mql) {
      mql = window.matchMedia(query);
    }

    matches.value = mql.matches;
    mql.addListener(handler);
  });

  onUnmounted(() => {
    mql.removeListener(handler);
  });

  return matches;
};
