import ValidateOTP from '@/components/forms/ValidateOTP';
import ValidatePin from '@/components/forms/ValidatePin';
import ChangePhoneNumber from '@/components/profile/editProfile/ChangePhoneNumber';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getUserInfo } from '@/repository/profile.repository';
import { useEffect, useState } from 'react';

const MainPhoneNumber: React.FC = () => {
  const [select, setSelect] = useState(0);
  const [number, setNumber] = useState('');
  const [method, setMethod] = useState('whatsapp');
  const [countdown, setCountdown] = useState(0);
  const getOTP = {
    method,
    phoneNumber: number
  };
  const [form, setForm] = useState<any>({
    name: '',
    seedsTag: '',
    email: '',
    avatar: '',
    bio: '',
    birthDate: '',
    phone: ''
  });
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const emptyPinIndex = pin.findIndex(number => number === '');
  const joinPin = pin.join('');
  const handleSubmit = async (): Promise<void> => {
    try {
      setSelect(1);
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };
  if (joinPin !== '' && emptyPinIndex === -1) {
    setPin(['', '', '', '', '', '']);
    handleSubmit()
      .then(() => {})
      .catch(() => {});
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setForm({
          name: dataInfo.name,
          seedsTag: dataInfo.seedsTag,
          email: dataInfo.email,
          avatar: dataInfo.avatar,
          bio: dataInfo.bio,
          birthDate: dataInfo.birthDate,
          phone: dataInfo.phoneNumber
        });
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

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

  return (
    <PageGradient defaultGradient className="z-0">
      <ValidatePin
        pin={pin}
        setPin={setPin}
        emptyPinIndex={emptyPinIndex}
        error={error}
        setError={setError}
        className={select === 0 ? 'flex' : 'hidden'}
        title="Enter Your PIN"
        setSelect={setSelect}
      />
      <ChangePhoneNumber
        form={form}
        setForm={setForm}
        setSelect={setSelect}
        select={select}
        setNumber={setNumber}
        getOTP={getOTP}
        setCountdown={setCountdown}
      />
      <ValidateOTP
        select={select}
        number={number}
        method={method}
        setMethod={setMethod}
        getOTP={getOTP}
        countdown={countdown}
        setCountdown={setCountdown}
      />
    </PageGradient>
  );
};

export default MainPhoneNumber;
