import type { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';

// reference: https://blog.openreplay.com/integrating-axios-with-react-hooks/

const useService = (
  axiosInstance: (...args: any) => Promise<any>
): {
  data: any;
  error: string;
  loading: boolean;
  execute: (...payload: any) => Promise<void>;
} => {
  // states
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async (...payload: any): Promise<void> => {
    setLoading(true);

    await new Promise<void>((resolve, reject) => {
      axiosInstance(...payload)
        .then((res: AxiosResponse) => {
          setData(res);
          resolve();
        })
        .catch((error: AxiosError) => {
          setError(error.message);
          reject(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return { data, error, loading, execute };
};

export default useService;
