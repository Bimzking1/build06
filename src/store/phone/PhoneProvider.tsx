import { useRouter } from 'next/router';
import {
  useContext,
  useState,
  type ReactNode,
  type SetStateAction
} from 'react';

import useInput from '@/hooks/useInput';

import { formatNumericHandler } from '@/helpers/useInputFormats';

import ErrorBEContext from '../error-be/error-be-context';
import LoadingContext from '../loading/loading-context';
import PhoneContext from './phone-context';

interface PhoneProviderProps {
  children: ReactNode;
}

const validatePhoneNumber = (value: string): boolean => {
  return value.length !== 0;
};

const PhoneProvider: React.FC<PhoneProviderProps> = ({ children }) => {
  const router = useRouter();
  const errorBECtx = useContext(ErrorBEContext);
  const loadingCtx = useContext(LoadingContext);

  const { value, isValid, isError, valueChangeHandler, inputBlurHandler } =
    useInput(validatePhoneNumber, formatNumericHandler);

  const [isAlreadyExist, setIsAlreadyExist] = useState(false);
  const [enteredCountryCode, setEnteredCountryCode] = useState('+62');
  const [selectedCountryFlag, setSelectedCountryFlag] = useState('ID');

  const resetHandler = (): void => {
    setIsAlreadyExist(false);
  };

  const countryCodeHandler = (
    countryCode: SetStateAction<string>,
    countryFlag: SetStateAction<string>
  ): void => {
    setEnteredCountryCode(countryCode);
    setSelectedCountryFlag(countryFlag);
  };

  const validatePhoneHandler = async (value: string): Promise<void> => {
    loadingCtx.loadingHandler(true);
    try {
      const response = await fetch(
        `https://seeds-dev.seeds.finance/auth/v1/validate/phone?phone=${value}`
      );

      setTimeout(() => {
        loadingCtx.loadingHandler(false);
      }, 800);

      if (!response.ok) {
        setIsAlreadyExist(true);

        const { message } = await response.json();
        errorBECtx.onOpen({
          code: response.status,
          message,
          type: 'popup',
          redirectUrl: '/'
        });
        throw message;
      }

      await router.push({
        pathname: '/send-otp-code',
        query: { target: 'whatsapp' }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const phoneContext = {
    phoneNumber: value,
    countryCode: enteredCountryCode,
    countryFlag: selectedCountryFlag,
    isValid,
    isError,
    isAlreadyExist,
    onChange: valueChangeHandler,
    onBlur: inputBlurHandler,
    onCountryCodeChange: countryCodeHandler,
    validatePhone: validatePhoneHandler,
    onReset: resetHandler
  };

  return (
    <PhoneContext.Provider value={phoneContext}>
      {children}
    </PhoneContext.Provider>
  );
};

export default PhoneProvider;
