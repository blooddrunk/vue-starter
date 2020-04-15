import { computed } from 'vue';

import usePagination from './use-pagination';

export default function useArrayPagination(arrayRef, paginationOptions = {}) {
  const pagination = usePagination({
    ...paginationOptions,
    total: computed(() => (arrayRef.value ? arrayRef.value.length : 0)),
  });

  const result = computed(() => {
    const array = arrayRef.value;

    if (!Array.isArray(array)) {
      return [];
    }

    return array.slice(
      pagination.offset.value,
      pagination.offset.value + pagination.perPage.value
    );
  });

  return {
    ...pagination,
    result,
  };
}
