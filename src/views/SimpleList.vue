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

    const { data: items, loading, fetchData } = useAsync({
      url: '/hn/search',
      params: {
        query: query.value,
      },
      transformData: ({ hits }) => hits,
    });

    console.log(items.value);

    fetchData();

    return {
      items,
      loading,
    };
  },
});
</script>
