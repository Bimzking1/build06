import { createContext, type Dispatch, type SetStateAction } from 'react';

interface PayloadType {
  otp: string;
  action: string;
}

const OTPContext = createContext({
  otp: '',
  changeOtpTarget: (payload: string): void => {},
  onContinue: (
    payload: PayloadType,
    setFirst: Dispatch<SetStateAction<string>>,
    setSecond: Dispatch<SetStateAction<string>>,
    setThird: Dispatch<SetStateAction<string>>,
    setFourth: Dispatch<SetStateAction<string>>
  ): void => {},
  resetOtp: () => {}
});

export default OTPContext;
