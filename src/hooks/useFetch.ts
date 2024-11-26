import type { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

import useDebounce from '@/hooks/useDebounce';

// reference: https://blog.openreplay.com/integrating-axios-with-react-hooks/

const useFetch = (
  callback: (...args: any) => Promise<any>,
  payload: any,
  debounceTimeout: number = 0
): { data: any; error: string; loading: boolean } => {
  // states
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  // debouncer
  const debouncerPayload = useDebounce(payload, debounceTimeout);

  useEffect(() => {
    setLoading(true);
    setError('');
    setData(null);

    callback(debouncerPayload)
      .then((res: AxiosResponse) => {
        setData(res);
      })
      .catch((error: AxiosError) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncerPayload, callback]);

  return { data, error, loading };
};

export default useFetch;
