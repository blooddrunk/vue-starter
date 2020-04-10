import useAsyncFn from './useAsyncFn';
import { useAxios } from '@/context/axios';

export default (url, requestConfig, initialData) => {
  if (typeof url !== 'string') {
    requestConfig = url;
    initialData = requestConfig;
  } else {
    requestConfig = requestConfig || {};
    requestConfig.url = url;
  }

  const axios = useAxios();

  return useAsyncFn(() => axios(requestConfig), initialData);
};
