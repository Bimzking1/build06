import SeedyAuthPass from '@/assets/auth/SeedyAuthPass.png';
import AuthNumber from '@/components/auth/AuthNumber';
import { checkPhoneNumber, getOtp } from '@/repository/auth.repository';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface IAuthForgotPassNumber {
  className: string;
  setSelect: any;
  formData: any;
  setFormData: any;
  setCountdown: any;
  countries: any;
  method: string;
}

const AuthForgotPassNumber: React.FC<IAuthForgotPassNumber> = ({
  className,
  setSelect,
  formData,
  setFormData,
  setCountdown,
  countries,
  method
}: IAuthForgotPassNumber) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [country, setCountry] = useState(101);
  const handleChange = (e: any, dialCode: any): void => {
    setError(false);
    if (formData.phoneNumber === dialCode) {
      setFormData({
        ...formData,
        phoneNumber: e.target.value.substring(dialCode.length)
      });
    } else if (formData.phoneNumber === '0') {
      setFormData({
        ...formData,
        phoneNumber: e.target.value.substring(1)
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleNext = async (): Promise<void> => {
    const formattedPhone = {
      ...formData,
      phoneNumber: `${countries[country].dialCode.replace('+', '') as string}${
        formData.phoneNumber as string
      }`
    };
    try {
      const response = await checkPhoneNumber(formattedPhone.phoneNumber);
      if (response === undefined) {
        setError(true);
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
      const getOTP = {
        method,
        phoneNumber: formattedPhone.phoneNumber
      };
      if (
        error.response.data.message === 'requested phone number already exists'
      ) {
        await getOtp(getOTP);
        setCountdown(60);
        setSelect(1);
        setFormData(formattedPhone);
      }
    }
  };

  return (
    <div
      className={`${className} flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4`}
    >
      <Image
        src={SeedyAuthPass}
        alt="SeedyAuthPass"
        className="w-[141.8px] md:flex hidden"
      />
      <Typography className="w-full font-poppins font-normal md:text-xl text-sm text-[#7C7C7C]">
        <span className="font-poppins font-semibold md:text-2xl text-base text-[#050522]">
          {t('authForgotPass.title1')}
        </span>
        <br />
        {t('authForgotPass.title2')}
      </Typography>
      <div className="w-full">
        <AuthNumber
          handleChange={handleChange}
          formData={formData.phoneNumber}
          name="phoneNumber"
          country={country}
          setCountry={setCountry}
          countries={countries}
          error={error}
          handleSubmit={async (e: any) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {error ? t('authForgotPass.validation.number') : <br />}
        </Typography>
      </div>
      <Button
        onClick={handleNext}
        disabled={formData.phoneNumber.length === 0}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] disabled:bg-[#BDBDBD] rounded-full w-full"
      >
        {t('authLogin.next')}
      </Button>
    </div>
  );
};

export default AuthForgotPassNumber;
