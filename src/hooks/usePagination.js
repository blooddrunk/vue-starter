import { computed, ref, toRefs, watch, readonly } from 'vue';

export default function usePagination(options = {}) {
  const { perPage = ref(10), total = ref(0), startPage = 1 } = toRefs(options);

  // Internal currentPage value
  const currentPage = ref(startPage);
  // public readonly ref for the currentPage
  // changing the current Page is only possible through the provided methods (see below)
  const page = readonly(currentPage);

  // Computed values
  const lastPage = computed(() =>
    total.value ? Math.ceil(total.value / perPage.value) : 0
  );
  const offset = computed(() =>
    Math.min((page.value - 1) * perPage.value, total.value)
  );

  // Functions
  const set = (value) => {
    if (typeof value !== 'number') {
      throw new Error(
        `[usePagination]: currentPage(${value}) must be of number type`
      );
    }
    currentPage.value = minmax(value, 1, lastPage.value);
  };

  const prev = () => set(page.value - 1);
  const next = () => set(page.value + 1);
  const first = () => set(1);
  const last = () => set(lastPage.value);

  // lastPage may never be < currentPage
  watch(
    [total, perPage],
    () => {
      if (currentPage.value > lastPage.value) {
        currentPage.value = lastPage.value;
      }
    },
    { lazy: true } // no need to run on first render
  );

  return {
    // Mutable state
    perPage,
    total,

    //Computed
    page,
    lastPage,
    offset,

    // Functions
    next,
    prev,
    first,
    last,
    set,
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
