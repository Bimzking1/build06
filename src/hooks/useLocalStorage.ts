import { getLocalStorage, setLocalStorage } from '@/utils/common/localStorage';
import { useEffect, useState } from 'react';

const isSSR = typeof window === 'undefined';

const useLocalStorage = (key: string, defaultValue: any): [any, any] => {
  const [storedValue, setStoredValue] = useState(() => defaultValue);

  useEffect(() => {
    if (!isSSR) setStoredValue(getLocalStorage(key, defaultValue));
  }, [key, defaultValue]);

  const setValue = (value: any): void => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (!isSSR) {
        setLocalStorage(key, valueToStore);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
