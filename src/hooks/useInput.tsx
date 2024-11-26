import { useState } from 'react';

const useInput = (
  validate?: null | ((value: string) => boolean),
  format?: (value: string) => string
): {
  value: string;
  isValid: boolean | undefined;
  isError: boolean | undefined;
  valueChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputBlurHandler: () => void;
  resetHandler: () => void;
} => {
  const [enteredValue, setEnteredValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  let isValid;
  let isError;

  if (validate !== undefined && validate !== null) {
    isValid = validate(enteredValue);
    isError = !isValid && isTouched;
  }

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // for populating a form with data from the BE
    if (typeof event === 'string') {
      setEnteredValue(event);
      return;
    }

    if (format !== undefined) {
      setEnteredValue(format(event.target.value));
    } else {
      setEnteredValue(event.target.value);
    }
  };

  const inputBlurHandler = (): void => {
    setIsTouched(true);
  };

  const resetHandler = (): void => {
    setEnteredValue('');
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid,
    isError,
    valueChangeHandler,
    inputBlurHandler,
    resetHandler
  };
};

export default useInput;
