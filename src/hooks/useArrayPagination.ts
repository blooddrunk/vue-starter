import { ref, computed, Ref, ComputedRef } from 'vue';

import {
  usePagination,
  UsePaginationOptions,
  UsePaginationReturn,
} from './usePagination';

export type UseArrayPaginationReturn<
  T extends unknown
> = UsePaginationReturn & {
  result: ComputedRef<T[]>;
};

export const useArrayPagination = <T extends unknown>(
  array: T[] | Ref<T[]>,
  paginationOptions: UsePaginationOptions = {}
): UseArrayPaginationReturn<T> => {
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
};
