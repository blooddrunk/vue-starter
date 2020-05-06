import { ref, computed } from 'vue';
import type { Ref } from 'vue';

import usePagination from './usePagination';
import type { PaginationOptions } from './usePagination';

export default function useArrayPagination<T extends any>(
  array: T[] | Ref<T[]>,
  paginationOptions: PaginationOptions = {}
) {
  const arrayRef = ref(array);

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
      pagination.offset.value + pagination.pageSize.value
    );
  });

  return {
    ...pagination,
    result,
  };
}
