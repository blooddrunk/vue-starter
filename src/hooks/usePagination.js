import { computed, watch } from 'vue';

import { wrap } from './helpers';
import { isNumeric } from '@/utils/common';

const ensureNumber = (value) => {
  if (typeof value !== 'undefined' && !isNumeric(value)) {
    throw new Error(`[usePagination]: (${value}) must be of number type`);
  }
};

export default function usePagination({
  pageSize: defaultPageSize = 10,
  total: defaultTotal = 0,
  currentPage: defaultPage = 1,
} = {}) {
  const _currentPage = wrap(defaultPage);
  const _pageSize = wrap(defaultPageSize);
  const _total = wrap(defaultTotal);

  // public getter & setter
  const currentPage = computed({
    get: () => _currentPage.value,
    set: (value) => {
      ensureNumber(value);
      _currentPage.value = minmax(value, 1, lastPage.value);
    },
  });

  const pageSize = computed({
    get: () => _pageSize.value,
    set: (value) => {
      ensureNumber(value);
      _pageSize.value = value;
    },
  });

  const total = computed({
    get: () => _total.value,
    set: (value) => {
      ensureNumber(value);
      _total.value = value;
    },
  });

  const lastPage = computed(() =>
    total.value ? Math.ceil(total.value / pageSize.value) : 1
  );
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
  watch(
    [total, pageSize],
    () => {
      if (currentPage.value > lastPage.value) {
        currentPage.value = lastPage.value;
      }
    },
    { lazy: true }
  );

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

const minmax = (value, min, max) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
