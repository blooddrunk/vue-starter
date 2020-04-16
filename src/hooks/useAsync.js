import { computed } from 'vue';

import useAsyncFn from './useAsyncFn';
import { useAxios } from '@/context/axios';

export default (url, requestConfig, initialData) => {
  if (typeof url === 'string') {
    requestConfig = requestConfig || {};
    requestConfig.url = url;
  } else {
    initialData = requestConfig;
    requestConfig = url;
  }

  const axios = useAxios();

  const immediate = requestConfig.immediate;
  delete requestConfig.immediate;

  const { data: response, ...rest } = useAsyncFn(
    () => axios(requestConfig),
    {
      data: initialData,
    },
    {
      immediate,
    }
  );

  const data = computed(() => response.value.data);

  return {
    ...rest,
    response,
    data,
  };
};
