import type { DefaultTFuncReturn } from 'i18next';
import { createContext } from 'react';

interface OpenParams {
  title: string | DefaultTFuncReturn;
  subtitle: string | DefaultTFuncReturn;
  redirectUrl?: string;
}

const SuccessContext = createContext({
  onOpen: (payload: OpenParams): void => {},
  onClose: (): void => {}
});

export default SuccessContext;
