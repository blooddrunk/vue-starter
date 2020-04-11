import isPlainObject from 'lodash/isPlainObject';
import { computed } from 'vue';

import useAsyncFn from './useAsyncFn';
import { useAxios } from '@/context/axios';

export default (url, requestConfig, initialData) => {
  if (isPlainObject(url)) {
    initialData = requestConfig;
    requestConfig = url;
  } else {
    requestConfig = requestConfig || {};
    requestConfig.url = url;
  }

  const axios = useAxios();

  const immediate = requestConfig.immediate;
  delete requestConfig.immediate;

  const { data: response, ...rest } = useAsyncFn(
    () => axios(requestConfig),
    initialData,
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
