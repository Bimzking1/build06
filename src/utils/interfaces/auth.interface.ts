import type React from 'react';
import type { Country } from './guest.interface';
import { type OTPDataI } from './otp.interface';

export interface Provider {
  provider: string;
  identifier: string;
}

export interface LoginFormData {
  phoneNumber: string;
  password: string;
  platform: string;
  os_name: string;
}

export interface AuthFormData {
  phoneNumber: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  password: string;
  provider: Provider;
  token?: string;
}

export interface ForgotPassData {
  oldPassword: string;
  password: string;
  phoneNumber: string;
}

export interface AuthNumberI<T extends Record<string, any>> {
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    dialCode: string,
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>
  ) => void;
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  name: string;
  country: number;
  setCountry: React.Dispatch<React.SetStateAction<number>>;
  countries: Country[];
  handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: boolean;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AuthVerificationI {
  className: string;
  setSelect: React.Dispatch<React.SetStateAction<number>>;
  formData: AuthFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  countries: Country[];
  method: string;
  loginForm: LoginFormData;
  setLoginForm: React.Dispatch<React.SetStateAction<LoginFormData>>;
  otpForm: OTPDataI;
  setOTPForm: React.Dispatch<React.SetStateAction<OTPDataI>>;
  country: number;
  setCountry: React.Dispatch<React.SetStateAction<number>>;
  guest: string;
  setGuest: React.Dispatch<React.SetStateAction<string>>;
}

export interface AuthForgotPassNumberI {
  className: string;
  setSelect: React.Dispatch<React.SetStateAction<number>>;
  formData: ForgotPassData;
  setFormData: React.Dispatch<React.SetStateAction<ForgotPassData>>;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  countries: Country[];
  method: string;
  country: number;
  setCountry: React.Dispatch<React.SetStateAction<number>>;
  otpForm: OTPDataI;
  setOTPForm: React.Dispatch<React.SetStateAction<OTPDataI>>;
}

export interface AuthPersonalDataI {
  className: string;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  formData: AuthFormData;
  loginForm: LoginFormData;
  guest: string;
}

export interface AuthRefI {
  open: boolean;
  handleOpen: () => void;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  formData: AuthFormData;
  loginForm: LoginFormData;
  guest: string;
}

export interface AuthBoDI {
  error: boolean;
  day: number | undefined;
  setDay: (day: number) => void;
  month: number | undefined;
  setMonth: (month: number) => void;
  year: number | undefined;
  setYear: (year: number) => void;
  handleChangeDoB: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface AuthCommonInputI {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: string;
  placeholder: string;
  label: string;
  type: string;
  name: string;
  error: boolean;
  required: boolean;
  handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface AuthForgotPassNewI {
  className: string;
  setSelect: React.Dispatch<React.SetStateAction<number>>;
  formData: ForgotPassData;
  setFormData: React.Dispatch<React.SetStateAction<ForgotPassData>>;
  handleOpen: () => void;
}

export interface AuthNameI {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  label: string;
  placeholder: string;
  handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface AuthPasswordI {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error: boolean;
  name: string;
  label: string;
  placeholder: string;
  handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface AuthSSOI {
  setSelect: (value: number) => void;
  setGuest: React.Dispatch<React.SetStateAction<string>>;
}
