<template>
  <section>
    <SearchHNForm
      :query="query"
      :on-query-change="handleQueryChange"
      @submit="handleSubmit"
    ></SearchHNForm>

    <div>
      <SimpleList
        :items="items"
        :loading="isLoading"
        item-key="objectID"
      ></SimpleList>
      <SimplePagination :pagination="pagination"></SimplePagination>
    </div>
  </section>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  watch,
} from 'vue';

import SimpleList from '@/components/SimpleList';
import SimplePagination from '@/components/SimplePagination';
import SearchHNForm from '@/components/SearchHNForm';
import { useAxios } from '@/hooks/useAxios';
import { usePagination } from '@/hooks/usePagination';

export default defineComponent({
  name: 'SimpleListView',

  components: {
    SimpleList,
    SimplePagination,
    SearchHNForm,
  },

  setup() {
    const query = ref('vue');
    const page = ref(1);

    const { data, isLoading, request } = useAxios(
      reactive({
        // '/hn/search' using proxy will take forever
        url: 'https://hn.algolia.com/api/v1/search',
        params: {
          query,
          page,
        },
        __needValidation: false,
        immediate: true,
      }),
      {}
    );

    const items = computed(() => data.value.hits);

    const handleQueryChange = (event) => {
      query.value = event.target.value;
    };

    const pagination = usePagination({ pageSize: 20 });

    watchEffect(() => {
      pagination.total.value = data.value.nbHits;
    });

    watch(pagination.currentPage, () => {
      page.value = pagination.currentPage.value;
      request();
    });

    const handleSubmit = (event) => {
      event.preventDefault();

      if (pagination.isFirst.value) {
        request();
      } else {
        pagination.first();
      }
    };

    return {
      query,
      items,
      isLoading,
      handleSubmit,
      handleQueryChange,

      pagination,
    };
  },
});
</script>
