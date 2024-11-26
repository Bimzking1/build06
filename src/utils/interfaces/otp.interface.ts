import type { StaticImageData } from 'next/image';

export interface OTPDataI {
  phoneNumber: string;
  method: string;
  otp: string;
  name?: string;
  token?: string;
}

export interface AuthOTPI {
  select: number;
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<string>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  image: StaticImageData;
  otpForm: OTPDataI;
  setOTPForm: React.Dispatch<React.SetStateAction<OTPDataI>>;
  setSelect: React.Dispatch<React.SetStateAction<number>>;
  country: number;
  guest?: string;
}
