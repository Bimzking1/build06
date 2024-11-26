import SeedyAuthPass from '@/assets/auth/SeedyAuthPass.png';
import SeedyLock from '@/assets/auth/SeedyLock.png';
import SeedySMSOTP from '@/assets/auth/SeedySMSOTP.png';
import SeedyWAOTP from '@/assets/auth/SeedyWAOTP.png';
import AuthForgotPassNew from '@/components/auth2/AuthForgotPassNew';
import AuthForgotPassNumber from '@/components/auth2/AuthForgotPassNumber';
import AuthModalPass from '@/components/auth2/AuthModalPass';
import AuthOTP from '@/components/auth2/AuthOTP';
import countries from '@/constants/countries.json';
import AuthLayout from '@/containers/auth/AuthLayout';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [select, setSelect] = useState(0);
  const [method, setMethod] = useState('sms');
  const [countdown, setCountdown] = useState(0);
  const [country, setCountry] = useState<number>(101);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    oldPassword: ''
  });

  const [formOTPData, setFormOTPData] = useState({
    phoneNumber: '',
    method,
    otp: ''
  });
  const handleOpen = (): void => {
    setOpen(!open);
  };

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
        src={SeedyAuthPass}
        alt="SeedyAuthPass"
        className={`${
          select === 0 ? 'flex' : 'hidden'
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
      <Image
        src={SeedyLock}
        alt="SeedyLock"
        className={`${
          select === 2 ? 'flex' : 'hidden'
        } md:hidden self-center w-1/2`}
      />
    </>
  );
  const form = (
    <>
      <AuthForgotPassNumber
        setSelect={setSelect}
        className={select === 0 ? 'flex' : 'hidden'}
        formData={formData}
        setFormData={setFormData}
        setCountdown={setCountdown}
        countries={countries}
        method={method}
        country={country}
        setCountry={setCountry}
        otpForm={formOTPData}
        setOTPForm={setFormOTPData}
      />
      <AuthOTP
        select={select}
        method={method}
        setMethod={setMethod}
        countdown={countdown}
        setCountdown={setCountdown}
        setSelect={setSelect}
        image={method === 'whatsapp' ? SeedyWAOTP : SeedySMSOTP}
        otpForm={formOTPData}
        setOTPForm={setFormOTPData}
        country={country}
      />
      <AuthForgotPassNew
        setSelect={setSelect}
        className={select === 2 ? 'flex' : 'hidden'}
        formData={formData}
        setFormData={setFormData}
        handleOpen={handleOpen}
      />
      <AuthModalPass handleOpen={handleOpen} open={open} />
    </>
  );
  return <AuthLayout elementChild={element} formChild={form} />;
};

export default ForgotPassword;
