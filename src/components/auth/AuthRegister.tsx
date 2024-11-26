import Backward from '@/assets/auth/Backward.svg';
import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import AuthNumber from '@/components/auth/AuthNumber';
import AuthPassword from '@/components/auth/AuthPassword';
import withRedirect from '@/helpers/withRedirect';
import { checkPhoneNumber, getOtp } from '@/repository/auth.repository';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthSSO from './AuthSSO';

interface IAuthRegister {
  className: string;
  setSelect: any;
  formData: any;
  setFormData: any;
  setCountdown: any;
  countries: any;
  method: string;
  loginForm: {
    phoneNumber: string;
    password: string;
    platform: string;
    os_name: string;
  };
  setLoginForm: any;
}

const AuthRegister: React.FC<IAuthRegister> = ({
  className,
  setSelect,
  formData,
  setFormData,
  setCountdown,
  countries,
  method,
  loginForm,
  setLoginForm
}: IAuthRegister) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [blank, setBlank] = useState(false);
  const [blankPass, setBlankPass] = useState(false);
  const [country, setCountry] = useState(101);
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const handleChange = (e: any, dialCode: any): void => {
    setError(false);
    setBlank(false);
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
  const handleChangePass = (e: any): void => {
    setErrorPass(false);
    setBlankPass(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (): Promise<void> => {
    const formattedPhone = {
      ...formData,
      phoneNumber: `${countries[country].dialCode.replace('+', '') as string}${
        formData.phoneNumber as string
      }`
    };
    const passTest = regex.test(formData.password);
    try {
      const response = await checkPhoneNumber(formattedPhone.phoneNumber);
      const getOTP = {
        method,
        phoneNumber: formattedPhone.phoneNumber
      };
      if (response === undefined && passTest) {
        await getOtp(getOTP);
        setCountdown(60);
        setSelect(1);
        setFormData(formattedPhone);
        setLoginForm({
          ...loginForm,
          phoneNumber: formattedPhone.phoneNumber,
          password: formattedPhone.password
        });
      }
    } catch (error: any) {
      toast(error.response.data.message, { type: 'error' });
      if (
        formattedPhone.phoneNumber.length ===
        countries[country].dialCode.replace('+', '').length
      ) {
        setError(true);
        setBlank(true);
      } else if (
        error.response.data.message === 'requested phone number already exists'
      ) {
        setError(true);
      }
    }
    if (formData.password === '') {
      setErrorPass(true);
      setBlankPass(true);
    } else if (!passTest) {
      setErrorPass(true);
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
        onClick={async () => {
          await withRedirect(router, router.query, '/auth');
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
        {t('authLogin.title2')}
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
          {error && blank ? (
            t('authLogin.validation.blank')
          ) : error ? (
            t('authLogin.validation.number')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <div className="w-full">
        <AuthPassword
          handleChange={handleChangePass}
          formData={formData.password}
          error={errorPass}
          name="password"
          label={t('authLogin.password').toString()}
          placeholder={t('authLogin.passwordPlaceholder').toString()}
          handleSubmit={async (e: any) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {errorPass && blankPass ? (
            t('authLogin.validation.blank')
          ) : errorPass ? (
            t('authLogin.validation.password')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <Button
        onClick={handleNext}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] rounded-full w-full"
      >
        {t('authLogin.next')}
      </Button>
      <AuthSSO setSelect={setSelect} />
    </div>
  );
};

export default AuthRegister;
