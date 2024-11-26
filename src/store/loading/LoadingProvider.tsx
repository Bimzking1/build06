import React, { useState, type ReactNode } from 'react';
import LoadingContext from './loading-context';

import Loading from '@/components/popup/Loading';

interface LoadingProps {
  children: ReactNode;
}

const LoadingProvider: React.FC<LoadingProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadingHandler = (payload: boolean): void => {
    setIsLoading(payload);
  };

  const loadingContext = {
    isLoading,
    loadingHandler
  };

  return (
    <LoadingContext.Provider value={loadingContext}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
