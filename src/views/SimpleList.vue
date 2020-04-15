<template>
  <section>
    <SearchHNForm
      :query="query"
      :on-query-change="handleQueryChange"
      @submit="handleSubmit"
    ></SearchHNForm>
    <SimpleList
      :items="items"
      :loading="loading"
      item-key="objectID"
    ></SimpleList>
  </section>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';

import SimpleList from '@/components/SimpleList';
import SearchHNForm from '@/components/SearchHNForm';
import useAsync from '@/hooks/useAsync';

export default defineComponent({
  name: 'SimpleListView',

  components: {
    SimpleList,
    SearchHNForm,
  },

  setup() {
    const query = ref('vue');

    const { data: items, loading, fetchData } = useAsync(
      reactive({
        url: 'https://hn.algolia.com/api/v1/search',
        params: {
          query,
        },
        __needValidation: false,
        transformData: ({ hits }) => hits,
      }),
      []
    );

    const handleQueryChange = (event) => {
      query.value = event.target.value;
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      fetchData();
    };

    return {
      query,
      items,
      loading,
      handleSubmit,
      handleQueryChange,
    };
  },
});
</script>
