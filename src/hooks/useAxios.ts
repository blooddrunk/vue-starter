import { ref, computed, Ref } from 'vue';
import { AxiosRequestConfig, CancelTokenSource, AxiosResponse } from 'axios';

import axios from '@/utils/axios';

type NonAxiosConfig = {
  immediate?: boolean;
};

type UseAxiosConfig = NonAxiosConfig & AxiosRequestConfig;

export const useAxios = <T = unknown>(
  requestConfig: UseAxiosConfig,
  initialData: T,
  { immediate = true }: NonAxiosConfig = {}
) => {
  // state
  const isLoading = ref(false);
  const isCompleted = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<T>(initialData) as Ref<T>;
  const response = ref<AxiosResponse<T>>();

  const isSuccessful = computed(() => isCompleted.value && !error.value);

  // cancel func
  const isCancelled = ref(false);
  let cancelSource: CancelTokenSource;
  const cancel = (message?: string) => {
    if (cancelSource) {
      cancelSource.cancel(message);
      isCancelled.value = true;
    }
  };

  const request = async () => {
    if (isLoading.value) {
      cancel(
        `[userAxios]: '${requestConfig.url}' cancelling request due to duplicate call`
      );
      return;
    }

    cancelSource = axios.CancelToken.source();

    isLoading.value = true;
    isCompleted.value = false;
    error.value = null;

    try {
      response.value = await axios.request<T>({
        cancelToken: cancelSource.token,
        ...requestConfig,
      });

      data.value = response.value.data;

      return data.value;
    } catch (error) {
      error.value = error;
      console.error(error);
    } finally {
      isLoading.value = false;
      isCompleted.value = true;
    }
  };

  if (immediate) {
    request();
  }

  return {
    isLoading,
    isCompleted,
    isSuccessful,
    error,
    data,
    response,
    request,
  };
};
