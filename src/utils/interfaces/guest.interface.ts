import type { OTPDataI } from './otp.interface';

export interface Country {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

export interface AuthGuestI {
  setSelect: React.Dispatch<React.SetStateAction<number>>;
  className: string;
  formData: OTPDataI;
  setFormData: React.Dispatch<React.SetStateAction<OTPDataI>>;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  countries: Country[];
  method: string;
  guest: string;
  setGuest: React.Dispatch<React.SetStateAction<string>>;
  country: number;
  setCountry: React.Dispatch<React.SetStateAction<number>>;
}
