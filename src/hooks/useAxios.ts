import { ref, computed, UnwrapRef } from 'vue';
import { AxiosRequestConfig, CancelTokenSource, AxiosResponse } from 'axios';

import useAsyncFn from './useAsyncFn';
import axios from '@/utils/axios';

type NonAxiosConfig = {
  immediate?: boolean;
  throwException?: boolean;
};

type UseAxiosConfig = NonAxiosConfig & AxiosRequestConfig;

const removeNonAxiosConfig = (
  configKey: (keyof NonAxiosConfig)[],
  requestConfig: UseAxiosConfig
) => {
  const removedConfig: NonAxiosConfig = {};
  configKey.forEach((key) => {
    removedConfig[key] = requestConfig[key];
    delete requestConfig[key];
  });
  return removedConfig;
};

type UseAxiosReturn = ReturnType<typeof useAsyncFn> & {
  response: ReturnType<typeof useAsyncFn>['data'];
};

type UseAxios<Result = unknown> = {
  (requestConfig: UseAxiosConfig, initialData: Result): UseAxiosReturn;
  (
    url: string,
    requestConfig: UseAxiosConfig,
    initialData: Result
  ): UseAxiosReturn;
};

export default <Result = unknown>(
  requestConfig: UseAxiosConfig,
  initialData?: Result
) => {
  const isCancelled = ref(false);

  let cancelSource: CancelTokenSource;
  const cancel = (message: string) => {
    if (cancelSource) {
      cancelSource.cancel(message);
      isCancelled.value = true;
    }
  };

  const useAsyncFnOptions = removeNonAxiosConfig(
    ['immediate', 'throwException'],
    requestConfig
  );

  const { data: response, request, ...rest } = useAsyncFn<
    Partial<AxiosResponse<Result>>
  >(
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

  const data = computed({
    get: () => {
      if (response.value) {
        return response.value.data;
      }

      return initialData;
    },
    set: (newValue) => {
      if (response.value) {
        response.value.data = newValue as UnwrapRef<Result>;
      }
    },
  });

  return {
    ...rest,
    request: (...args: unknown[]) => {
      if (rest.isLoading) {
        cancel(
          `[useAsync]: '${requestConfig.url}' cancelling request due to duplicate call`
        );
      }
      return request(...args);
    },
    cancel,
    response,
    data,
  };
};
