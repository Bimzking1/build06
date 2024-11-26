import { createContext } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  loadingHandler: (payload: boolean): void => {}
});

export default LoadingContext;
