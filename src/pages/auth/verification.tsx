import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import SeedySMSOTP from '@/assets/auth/SeedySMSOTP.png';
import SeedyWAOTP from '@/assets/auth/SeedyWAOTP.png';
import AuthOTP from '@/components/auth2/AuthOTP';
import AuthPersonalData from '@/components/auth2/AuthPersonalData';
import AuthVerification from '@/components/auth2/AuthVerification';
import countries from '@/constants/countries.json';
import AuthLayout from '@/containers/auth/AuthLayout';
import queryList from '@/helpers/queryList';
import type { OTPDataI } from '@/utils/interfaces/otp.interface';
import DeviceDetector from 'device-detector-js';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LoginFormData {
  phoneNumber: string;
  password: string;
  platform: string;
  os_name: string;
}

const Register: React.FC = () => {
  const deviceDetector = new DeviceDetector();
  const { queries } = queryList();
  const { data } = useSession();
  const [select, setSelect] = useState<number>(0);
  const [guest, setGuest] = useState<string>('');
  const [method, setMethod] = useState('sms');
  const [countdown, setCountdown] = useState(0);
  const [country, setCountry] = useState<number>(101);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    birthDate: '',
    name: '',
    seedsTag: '',
    refCode: '',
    password: '',
    provider: {
      provider: '',
      identifier: ''
    }
  });
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    phoneNumber: '',
    password: '',
    platform: '',
    os_name: ''
  });

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
  useEffect(() => {
    setFormData({
      ...formData,
      birthDate: `${new Date(
        new Date().getFullYear() - 17,
        new Date().getMonth(),
        new Date().getDate()
      ).toISOString()}`,

      name:
        data !== null && data !== undefined ? (data?.user?.name as string) : '',
      seedsTag:
        data !== null && data !== undefined
          ? `${data?.user?.name?.split(' ').join('') as string}${Math.round(
              Math.random() * 1000
            )}`
          : '',
      provider: {
        provider: data !== null && data !== undefined ? data?.provider : '',
        identifier: data !== null && data !== undefined ? data?.accessToken : ''
      }
    });
  }, [data]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, token: otpForm.token }));
  }, [otpForm.token]);

  useEffect(() => {
    setLoginForm({
      ...loginForm,
      platform: `${
        deviceDetector.parse(navigator.userAgent).device?.type as string
      }_web`,
      os_name: `${deviceDetector.parse(navigator.userAgent).os?.name as string}`
    });
    if (queries.rc !== undefined) {
      setFormData({ ...formData, refCode: queries.rc });
    }
  }, []);
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
      <AuthVerification
        className={select === 0 ? 'flex' : 'hidden'}
        setSelect={setSelect}
        formData={formData}
        setFormData={setFormData}
        setCountdown={setCountdown}
        countries={countries}
        method={method}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        otpForm={otpForm}
        setOTPForm={setOTPForm}
        country={country}
        setCountry={setCountry}
        guest={guest}
        setGuest={setGuest}
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
        country={country}
        guest={guest}
      />
      <AuthPersonalData
        className={select === 2 ? 'flex' : 'hidden'}
        setFormData={setFormData}
        formData={formData}
        guest={guest}
        loginForm={loginForm}
      />
    </>
  );
  return <AuthLayout elementChild={element} formChild={form} />;
};

export default Register;
