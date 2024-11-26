import { createContext, type SetStateAction } from 'react';

const PhoneContext = createContext({
  phoneNumber: '',
  countryCode: '',
  countryFlag: '',
  isValid: false as boolean | undefined,
  isError: false as boolean | undefined,
  isAlreadyExist: false,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {},
  onBlur: () => {},
  onCountryCodeChange: (
    countryCode: SetStateAction<string>,
    countryFlag: SetStateAction<string>
  ): void => {},
  validatePhone: (value: string) => {},
  onReset: () => {}
});

export default PhoneContext;
