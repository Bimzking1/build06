import Backward from '@/assets/auth/Backward.svg';
import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import {
  handleChangePhoneNumber,
  handleFormattedData
} from '@/helpers/authFormData';
import { handleGetOTP } from '@/helpers/OTP';
import { checkPhoneNumber } from '@/repository/auth.repository';
import { type AuthGuestI } from '@/utils/interfaces/guest.interface';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthName from './AuthName';
import AuthNumber from './AuthNumber';

const AuthGuest: React.FC<AuthGuestI> = ({
  setSelect,
  className,
  formData,
  setFormData,
  setCountdown,
  countries,
  method,
  guest,
  setGuest,
  country,
  setCountry
}: AuthGuestI) => {
  const router = useRouter();
  const { t } = useTranslation();
  const formattedData = handleFormattedData(formData, country);

  const handleCheckPhone = async (): Promise<void> => {
    try {
      const response = await checkPhoneNumber(formattedData.phoneNumber);
      if (response === undefined) {
        setGuest('guest-register');
      }
    } catch {
      await handleNext();
    }
  };

  const handleNext = async (): Promise<void> => {
    try {
      const response = await checkPhoneNumber(formattedData.phoneNumber);
      if (response === undefined) {
        await handleGetOTP(method, setCountdown, setSelect, formattedData);
      }
    } catch (error: any) {
      setGuest('guest-login');
      await handleGetOTP(method, setCountdown, setSelect, formattedData);
      if (guest !== 'guest-login') {
        toast.error(error.response.data.message ?? 'Unknown Error');
      }
    }
  };

  return (
    <div
      className={`${className} flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4`}
    >
      <Image
        src={Backward}
        alt="Backward"
        className="absolute left-5 top-5 cursor-pointer"
        onClick={() => {
          router.back();
        }}
      />
      <Image
        src={SeedyAuthLogin}
        alt="SeedyAuthLogin"
        className="w-[141.8px] md:flex hidden"
      />
      <Typography className="w-full font-poppins font-semibold md:text-2xl text-base text-[#050522] pt-10 md:p-0">
        <span className="font-poppins font-normal md:text-xl text-sm text-[#7C7C7C]">
          {t('authLogin.title1')}
        </span>
        <br />
        {guest === 'guest-register'
          ? t('authLogin.title4')
          : t('authLogin.title3')}
      </Typography>
      {guest === 'guest-register' && (
        <AuthName
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
          }}
          value={formData.name as string}
          name="name"
          label={t('authLogin.name').toString()}
          placeholder={t('authLogin.namePlaceholder').toString()}
          handleSubmit={async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
      )}
      <AuthNumber
        handleChange={handleChangePhoneNumber}
        formData={formData}
        setFormData={setFormData}
        name="phoneNumber"
        country={country}
        setCountry={setCountry}
        countries={countries}
        handleSubmit={async (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            if (guest === 'guest-register') {
              await handleNext();
            } else {
              await handleCheckPhone();
            }
          }
        }}
      />
      <Button
        disabled={
          formData.phoneNumber.length === 0 ||
          (guest === 'guest-register' &&
            (formData.name === undefined || formData.name === ''))
        }
        onClick={guest === 'guest-register' ? handleNext : handleCheckPhone}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] disabled:bg-[#BDBDBD] rounded-full w-full"
      >
        {t('authLogin.login')}
      </Button>
      {/* <AuthSSO setSelect={setSelect} /> */}
    </div>
  );
};

export default AuthGuest;
