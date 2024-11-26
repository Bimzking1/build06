import { createContext } from 'react';

const EmailContext = createContext({
  email: '',
  isValid: false as boolean | undefined,
  isError: false as boolean | undefined,
  isAlreadyExist: false,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {},
  onBlur: () => {},
  validateEmail: (value: string) => {},
  onReset: () => {}
});

export default EmailContext;
