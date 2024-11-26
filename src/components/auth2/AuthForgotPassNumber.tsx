import Backward from '@/assets/auth/Backward.svg';
import SeedyAuthPass from '@/assets/auth/SeedyAuthPass.png';
import {
  handleChangePhoneNumber,
  handleFormattedData
} from '@/helpers/authFormData';
import { handleGetOTP } from '@/helpers/OTP';
import { checkPhoneNumber } from '@/repository/auth.repository';
import type { AuthForgotPassNumberI } from '@/utils/interfaces/auth.interface';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthNumber from './AuthNumber';

const AuthForgotPassNumber: React.FC<AuthForgotPassNumberI> = ({
  className,
  setSelect,
  formData,
  setFormData,
  setCountdown,
  countries,
  method,
  country,
  setCountry,
  otpForm,
  setOTPForm
}: AuthForgotPassNumberI) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<boolean>(false);
  const [blank, setBlank] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const formattedData = handleFormattedData(otpForm, country);

  const handleNext = async (): Promise<void> => {
    try {
      setLoading(true);
      if (
        formattedData.phoneNumber.length ===
        countries[country].dialCode.replace('+', '').length
      ) {
        setBlank(true);
        setError(true);
        throw new Error();
      }
      const response = await checkPhoneNumber(formattedData.phoneNumber);
      if (response === undefined) {
        setError(true);
      }
    } catch (error: any) {
      if (
        error?.response?.data?.message !==
        'requested phone number already exists'
      ) {
        toast.error(error?.response?.data?.message);
      }
      if (
        error?.response?.data?.message ===
        'requested phone number already exists'
      ) {
        await handleGetOTP(method, setCountdown, setSelect, formattedData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      phoneNumber: formattedData.phoneNumber
    });
  }, [formattedData.phoneNumber]);

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
        src={SeedyAuthPass}
        alt="SeedyAuthPass"
        className="w-[141.8px] md:flex hidden"
      />
      <Typography className="w-full font-poppins font-normal md:text-xl text-sm text-[#7C7C7C] pt-10 md:p-0">
        <span className="font-poppins font-semibold md:text-2xl text-base text-[#050522]">
          {t('authForgotPass.title1')}
        </span>
        <br />
        {t('authForgotPass.title2')}
      </Typography>
      <div className="w-full">
        <AuthNumber
          handleChange={handleChangePhoneNumber}
          formData={otpForm}
          setFormData={setOTPForm}
          name="phoneNumber"
          country={country}
          setCountry={setCountry}
          countries={countries}
          error={error}
          setError={setError}
          handleSubmit={async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {blank && error ? (
            t('authLogin.validation.blank')
          ) : error ? (
            t('authForgotPass.validation.number')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <Button
        onClick={handleNext}
        disabled={isLoading}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] disabled:bg-[#BDBDBD] rounded-full w-full"
      >
        {isLoading ? <Spinner className=" h-6 w-6" /> : t('authLogin.next')}
      </Button>
    </div>
  );
};

export default AuthForgotPassNumber;
