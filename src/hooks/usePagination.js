import { computed, ref, watch } from 'vue';

export default function usePagination({
  perPage = 10,
  total = 0,
  startPage = 1,
} = {}) {
  perPage = ref(perPage);
  total = ref(total);

  // internal state
  const currentPage = ref(startPage);

  // public getter & setter
  const page = computed({
    get: () => currentPage.value,
    set: (value) => {
      if (typeof value !== 'number') {
        throw new Error(
          `[usePagination]: currentPage(${value}) must be of number type`
        );
      }
      currentPage.value = minmax(value, 1, lastPage.value);
    },
  });

  const lastPage = computed(() =>
    total.value ? Math.ceil(total.value / perPage.value) : 1
  );
  const offset = computed(() =>
    Math.min((page.value - 1) * perPage.value, total.value)
  );
  const isFirst = computed(() => page.value === 1);
  const isLast = computed(() => page.value === lastPage.value);

  const prev = () => {
    --page.value;
  };
  const next = () => {
    ++page.value;
  };
  const first = () => {
    page.value = 1;
  };
  const last = () => {
    page.value = lastPage.value;
  };

  // lastPage may never be < currentPage
  watch(
    [total, perPage],
    () => {
      if (currentPage.value > lastPage.value) {
        currentPage.value = lastPage.value;
      }
    },
    { lazy: true }
  );

  return {
    // Mutable state
    perPage,
    total,

    page,

    //computed
    lastPage,
    offset,
    isFirst,
    isLast,

    // Functions
    next,
    prev,
    first,
    last,
  };
}

const minmax = (value, min, max) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
