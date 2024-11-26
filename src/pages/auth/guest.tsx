import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import SeedySMSOTP from '@/assets/auth/SeedySMSOTP.png';
import SeedyWAOTP from '@/assets/auth/SeedyWAOTP.png';
import AuthGuest from '@/components/auth2/AuthGuest';
import AuthOTP from '@/components/auth2/AuthOTP';
import countries from '@/constants/countries.json';
import AuthLayout from '@/containers/auth/AuthLayout';
import type { OTPDataI } from '@/utils/interfaces/otp.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const GuestCheck: React.FC = () => {
  const [select, setSelect] = useState<number>(0);
  const [countdown, setCountdown] = useState(0);
  const [country, setCountry] = useState(101);
  const [method, setMethod] = useState('sms');
  const [guest, setGuest] = useState<string>('guest-login');
  const [otpForm, setOTPForm] = useState<OTPDataI>({
    phoneNumber: '',
    method,
    otp: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countdown]);

  const element = (
    <>
      <Image
        src={SeedyAuthLogin}
        alt="SeedyAuthLogin"
        className={`${
          select === 0 || select === 2 ? 'flex' : 'hidden'
        } md:hidden self-center w-1/2`}
      />
      <Image
        src={SeedyWAOTP}
        alt="SeedyWAOTP"
        className={`${
          select === 1 && method === 'whatsapp' ? 'flex' : 'hidden'
        } md:hidden self-center w-1/2`}
      />
      <Image
        src={SeedySMSOTP}
        alt="SeedySMSOTP"
        className={`${
          select === 1 && method === 'sms' ? 'flex' : 'hidden'
        } md:hidden self-center w-1/2`}
      />
    </>
  );
  const form = (
    <>
      <AuthGuest
        setSelect={setSelect}
        className={select === 0 ? 'flex' : 'hidden'}
        formData={otpForm}
        setFormData={setOTPForm}
        setCountdown={setCountdown}
        countries={countries}
        method={method}
        guest={guest}
        setGuest={setGuest}
        country={country}
        setCountry={setCountry}
      />
      <AuthOTP
        select={select}
        method={method}
        setMethod={setMethod}
        countdown={countdown}
        setCountdown={setCountdown}
        setSelect={setSelect}
        image={method === 'whatsapp' ? SeedyWAOTP : SeedySMSOTP}
        otpForm={otpForm}
        setOTPForm={setOTPForm}
        guest={guest}
        country={country}
      />
    </>
  );
  return <AuthLayout elementChild={element} formChild={form} />;
};

export default GuestCheck;
