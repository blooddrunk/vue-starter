import { ref, computed } from 'vue';
import { AxiosRequestConfig, CancelTokenSource, AxiosResponse } from 'axios';

import { useAsyncFn, UseAsyncFnReturn } from './useAsyncFn';
import axios from '@/utils/axios';

type NonAxiosConfig = {
  immediate?: boolean;
  throwException?: boolean;
};

type UseAxiosConfig = NonAxiosConfig & AxiosRequestConfig;

type UseAxiosReturn = UseAsyncFnReturn & {
  response: ReturnType<typeof useAsyncFn>['data'];
  cancel: (message?: string) => void;
};

// type UseAxios<Result = unknown> = {
//   (requestConfig: UseAxiosConfig, initialData: Result): UseAxiosReturn;
//   (
//     url: string,
//     requestConfig: UseAxiosConfig,
//     initialData: Result
//   ): UseAxiosReturn;
// };

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

export const useAxios = <Result = unknown>(
  requestConfig: UseAxiosConfig,
  initialData?: Result
): UseAxiosReturn => {
  const isCancelled = ref(false);

  let cancelSource: CancelTokenSource;
  const cancel = (message?: string) => {
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
        response.value.data = newValue;
      }
    },
  });

  return {
    ...rest,
    request: (...args: unknown[]): ReturnType<typeof request> => {
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
