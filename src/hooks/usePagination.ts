import { ref, computed, watch, Ref } from 'vue';

import { isNumeric } from '@/utils/common';

const ensureNumber = (value: number | string) => {
  if (typeof value !== 'undefined' && !isNumeric(value)) {
    throw new Error(`[usePagination]: (${value}) must be of number type`);
  }
};

const minmax = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

export type PaginationOptions = Partial<{
  pageSize: number | Ref<number>;
  total: number | Ref<number>;
  currentPage: number | Ref<number>;
}>;

export default function usePagination({
  pageSize: defaultPageSize = 10,
  total: defaultTotal = 0,
  currentPage: defaultPage = 1,
}: PaginationOptions = {}) {
  const _currentPage = ref(defaultPage);
  const _pageSize = ref(defaultPageSize);
  const _total = ref(defaultTotal);

  const total = computed({
    get: () => _total.value,
    set: (value) => {
      ensureNumber(value);
      _total.value = value;
    },
  });

  const pageSize = computed({
    get: () => _pageSize.value,
    set: (value) => {
      ensureNumber(value);
      _pageSize.value = value;
    },
  });

  const lastPage = computed(() =>
    total.value ? Math.ceil(total.value / pageSize.value) : 1
  );
  // public getter & setter
  const currentPage = computed({
    get: () => _currentPage.value,
    set: (value) => {
      ensureNumber(value);
      _currentPage.value = minmax(value, 1, lastPage.value);
    },
  });

  const offset = computed(() =>
    Math.min((currentPage.value - 1) * pageSize.value, total.value)
  );
  const isFirst = computed(() => currentPage.value === 1);
  const isLast = computed(() => currentPage.value === lastPage.value);

  const prev = () => {
    --currentPage.value;
  };
  const next = () => {
    ++currentPage.value;
  };
  const first = () => {
    currentPage.value = 1;
  };
  const last = () => {
    currentPage.value = lastPage.value;
  };

  // lastPage may never be < currentPage
  watch([total, pageSize], () => {
    if (currentPage.value > lastPage.value) {
      currentPage.value = lastPage.value;
    }
  });

  return {
    pageSize,
    total,
    currentPage,

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
