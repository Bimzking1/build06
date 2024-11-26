import DetectiveSeedy from '@/assets/microsite-quiz/DetectiveSeedy.png';
import countries from '@/constants/countries.json';
import {
  handleChangePhoneNumber,
  handleFormattedData
} from '@/helpers/authFormData';
import { AuthLocalStorage } from '@/helpers/authLocalStorage';
import {
  checkEmail,
  checkPhoneNumber,
  quickRegister
} from '@/repository/auth.repository';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { Button, Dialog, Spinner, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthCommonInput from '../auth2/AuthCommonInput';
import AuthNumber from '../auth2/AuthNumber';

interface Props {
  id: string;
  open: boolean;
  useCoins: boolean;
  detailQuiz: IDetailQuiz | undefined;
  handleInvitationCode: () => Promise<void>;
  handleOpen: () => void;
}
interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
}

const FormModal: React.FC<Props> = ({
  id,
  open,
  useCoins,
  detailQuiz,
  handleInvitationCode,
  handleOpen
}: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [country, setCountry] = useState(101);
  const [error, setError] = useState<{
    email: string;
    phoneNumber: boolean;
  }>({
    email: '',
    phoneNumber: false
  });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: ''
  });

  const formattedData = handleFormattedData(formData, country);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError({ ...error, email: '' });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (): Promise<void> => {
    try {
      setLoading(true);
      await checkEmail(formattedData.email);
      await checkPhoneNumber(formattedData.phoneNumber);
      const response = await quickRegister({
        ...formattedData,
        name: `${formattedData.name}_${formattedData.email}`,
        phone_number: formattedData.phoneNumber
      });
      AuthLocalStorage(response);
      if (localStorage.getItem('accessToken') !== null) {
        if (detailQuiz?.participant_status === 'JOINED') {
          await router.push(`/microsite-quiz/${id}/start`);
        } else {
          if (
            detailQuiz?.is_need_invitation_code !== undefined &&
            detailQuiz.is_need_invitation_code
          ) {
            await handleInvitationCode();
          } else {
            await router.push(
              `/microsite-quiz/${id}/welcome?useCoins=${
                useCoins ? 'true' : 'false'
              }`
            );
          }
        }
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        setError(prev => ({ ...prev, email: 'incorrect' }));
      } else if (
        error.response.data.message === 'requested email already exists'
      ) {
        setError(prev => ({ ...prev, email: 'already' }));
      } else if (
        error.response.data.message === 'requested phone number already exists'
      ) {
        setError(prev => ({ ...prev, phoneNumber: true }));
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.key === 'Enter') {
      await handleSave();
    }
  };

  useEffect(() => {
    setError({ ...error, phoneNumber: false });
  }, [formData.phoneNumber]);
  return (
    <Dialog
      dismiss={{ enabled: !loading }}
      open={open}
      handler={handleOpen}
      className="flex flex-col gap-4 items-center p-4 m-0 relative"
    >
      <Image
        src={DetectiveSeedy}
        alt="DetectiveSeedy"
        width={500}
        height={500}
        className=" w-[250px]"
      />
      <AuthCommonInput
        handleChange={handleChange}
        name="name"
        formData={formData.name}
        placeholder={`${t('micrositeQuiz.placeName')}`}
        label={`${t('micrositeQuiz.name')}`}
        type="text"
        error={false}
        required
        handleSubmit={handleSubmit}
      />
      <div className="w-full">
        <AuthCommonInput
          handleChange={handleChange}
          name="email"
          formData={formData.email}
          placeholder={`${t('micrositeQuiz.placeEmail')}`}
          label={`${t('micrositeQuiz.email')}`}
          type="email"
          error={error.email === 'already' || error.email === 'incorrect'}
          required
          handleSubmit={handleSubmit}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {error.email === 'incorrect' ? (
            t('micrositeQuiz.errorEmailIncorrect')
          ) : error.email === 'already' ? (
            t('micrositeQuiz.errorEmailAlready')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <div className="w-full">
        <AuthNumber
          handleChange={handleChangePhoneNumber}
          formData={formData}
          setFormData={setFormData}
          name="phoneNumber"
          country={country}
          setCountry={setCountry}
          countries={countries}
          handleSubmit={handleSubmit}
          error={error.phoneNumber}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {error.phoneNumber ? t('micrositeQuiz.errorPhone') : <br />}
        </Typography>
      </div>
      <Button
        disabled={
          formData.name === '' ||
          formData.email === '' ||
          formData.phoneNumber === '' ||
          loading
        }
        onClick={handleSave}
        className="rounded-full w-full capitalize font-poppins font-semibold text-white text-base bg-[#3AC4A0] disabled:bg-[#BDBDBD] flex justify-center"
      >
        {loading ? <Spinner className=" h-6 w-6" /> : t('micrositeQuiz.save')}
      </Button>
    </Dialog>
  );
};

export default FormModal;
