import ValidatePin from '@/components/forms/ValidatePin';
import ChangeEmail from '@/components/profile/editProfile/ChangeEmail';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getUserInfo } from '@/repository/profile.repository';
import { useEffect, useState } from 'react';

const MainEmail: React.FC = () => {
  const [select, setSelect] = useState(0);
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
      console.error(error.response?.data?.message);
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
      <ChangeEmail form={form} setForm={setForm} select={select} />
    </PageGradient>
  );
};

export default MainEmail;
