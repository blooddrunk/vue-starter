<template>
  <section>
    <SimpleList :items="items" :loading="loading"></SimpleList>
  </section>
</template>

<script>
import { ref, defineComponent } from 'vue';

import SimpleList from '@/components/SimpleList';
import useAsync from '@/hooks/useAsync';

export default defineComponent({
  name: 'SimpleListView',

  components: {
    SimpleList,
  },

  setup() {
    const query = ref('');

    const { data, loading, fetchData } = useAsync(
      {
        url: 'https://jsonplaceholder.typicode.com/posts',
        params: {
          query: query.value,
        },
        __needValidation: false,
        // transformData: ({ hits }) => hits,
      },
      []
    );

    fetchData();

    return {
      items: data,
      loading,
    };
  },
});
</script>
