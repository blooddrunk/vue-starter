import { ref, computed } from 'vue';

import useAsyncFn from './useAsyncFn';
import axios from '@/utils/axios';

const removeNonAxiosConfig = (configKey, requestConfig) => {
  const removedConfig = {};
  configKey.forEach((key) => {
    removedConfig[key] = requestConfig[key];
    delete requestConfig[key];
  });
  return removedConfig;
};

export default (url, requestConfig, initialData) => {
  if (typeof url === 'string') {
    requestConfig = requestConfig || {};
    requestConfig.url = url;
  } else {
    initialData = requestConfig;
    requestConfig = url;
  }

  const isCancelled = ref(false);

  let cancelSource;
  const cancel = (message) => {
    if (cancelSource) {
      cancelSource.cancel(message);
      isCancelled.value = true;
    }
  };

  const useAsyncFnOptions = removeNonAxiosConfig(
    ['immediate', 'throwException'],
    requestConfig
  );

  const { data: response, fetchData, ...rest } = useAsyncFn(
    () => {
      cancelSource = axios.CancelToken.source();

      return axios({
        cancelToken: cancelSource.token,
        ...requestConfig,
      });
    },
    {
      data: initialData,
    },
    useAsyncFnOptions
  );

  const data = computed(() => response.value.data);

  return {
    ...rest,
    fetchData: (...args) => {
      if (rest.isLoading) {
        cancel(
          `[useAsync]: '${requestConfig.url}' cancelling request due to duplicate call`
        );
      }
      fetchData(...args);
    },
    cancel,
    response,
    data,
  };
};
