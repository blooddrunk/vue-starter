import { computed, Ref } from 'vue';

import { useMediaQuery } from './useMediaQuery';

const queries = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)',
  'no-preference': '(prefers-color-scheme: no-preference)',
};

export const usePreferredColorScheme = (): Ref<
  'dark' | 'light' | 'no-preference'
> => {
  const isDark = useMediaQuery(queries.dark);
  const isLight = useMediaQuery(queries.light);

  const theme = computed(() => {
    if (isDark.value) {
      return 'dark';
    }

    if (isLight.value) {
      return 'light';
    }

    return 'no-preference';
  });

  return theme;
};
