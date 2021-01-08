import { ref, computed, unref, Ref } from 'vue';
import { AxiosRequestConfig, CancelTokenSource, AxiosResponse } from 'axios';

import { Refable } from '@/utils/typings';
import axios from '@/utils/axios';

type UseAxiosConfig = {
  immediate?: boolean;
};

export const useAxios = <T = unknown>(
  requestConfig: Refable<AxiosRequestConfig>,
  initialData: T,
  { immediate = true }: UseAxiosConfig = {}
) => {
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
    const unwrappedConfig = unref(requestConfig);

    if (isLoading.value) {
      cancel(
        `[userAxios]: '${unwrappedConfig.url}' cancelling request due to duplicate call`
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
        ...unwrappedConfig,
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
