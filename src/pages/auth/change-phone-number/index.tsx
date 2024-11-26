import SeedySMSOTP from '@/assets/auth/SeedySMSOTP.png';
import SeedyWAOTP from '@/assets/auth/SeedyWAOTP.png';
import AuthOTP from '@/components/auth2/AuthOTP';
import AuthLayout from '@/containers/auth/AuthLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ChangeNumber: React.FC = () => {
  const { number, country } = useRouter().query;
  const [select, setSelect] = useState(1);
  const [method, setMethod] = useState('sms');
  const [countdown, setCountdown] = useState(0);

  const [formOTPData, setFormOTPData] = useState({
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
    setCountdown(60);
  }, []);

  useEffect(() => {
    if (number !== undefined && country !== undefined) {
      setFormOTPData({
        ...formOTPData,
        phoneNumber: `${number as string}`
      });
    }
  }, [number, country]);
  const element = (
    <>
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
        country={Number(country)}
      />
    </>
  );
  return <AuthLayout elementChild={element} formChild={form} />;
};

export default ChangeNumber;
