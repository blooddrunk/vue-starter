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

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  watch,
} from 'vue';

import SimpleList from '@/components/SimpleList.vue';
import SimplePagination from '@/components/SimplePagination.vue';
import SearchHNForm from '@/components/SearchHNForm.vue';
import { useAxios } from '@/hooks/useAxios';
import { usePagination } from '@/hooks/usePagination';

export type ListItem = {
  id: string;
  title: string | null;
  url?: string | null;
};

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

    const { data, isLoading, request } = useAxios<{
      hits: ListItem[];
      nbHits: number;
    }>(
      reactive({
        // ? '/hn/search' using proxy will take forever
        url: 'https://hn.algolia.com/api/v1/search',
        params: {
          query,
          page,
        },
        __needValidation: false,
      }),
      {
        hits: [],
        nbHits: 0,
      }
    );

    const items = computed(() => data.value?.hits || []);

    const handleQueryChange = (event: Event) => {
      query.value = (event.target as HTMLInputElement).value;
    };

    const pagination = usePagination({ pageSize: 20 });

    watchEffect(() => {
      pagination.total.value = data.value?.nbHits || 0;
    });

    watch(pagination.currentPage, () => {
      page.value = pagination.currentPage.value;
      request();
    });

    const handleSubmit = (event: Event) => {
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
