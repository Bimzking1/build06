import Backward from '@/assets/auth/Backward.svg';
import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import AuthPassword from '@/components/auth2/AuthPassword';
import {
  handleChangePhoneNumber,
  handleFormattedData
} from '@/helpers/authFormData';
import { AuthLocalStorage } from '@/helpers/authLocalStorage';
import TrackerEvent from '@/helpers/GTM';
import { handleGetOTP } from '@/helpers/OTP';
import withRedirect from '@/helpers/withRedirect';
import {
  checkPhoneNumber,
  forgotPassword,
  loginPhoneNumber,
  validateSetupPassword
} from '@/repository/auth.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { fetchExpData } from '@/store/redux/features/exp';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch } from '@/store/redux/store';
import type { AuthVerificationI } from '@/utils/interfaces/auth.interface';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthNumber from './AuthNumber';
import AuthSSO from './AuthSSO';

const AuthVerification: React.FC<AuthVerificationI> = ({
  className,
  setSelect,
  formData,
  setFormData,
  setCountdown,
  countries,
  method,
  loginForm,
  setLoginForm,
  otpForm,
  setOTPForm,
  country,
  setCountry,
  guest,
  setGuest
}: AuthVerificationI) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data } = useSession();
  const isQuery = Object.keys(router.query).length > 0;
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [blank, setBlank] = useState(false);
  const [blankPass, setBlankPass] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const passTest = regex.test(formData.password);
  const formattedData = handleFormattedData(otpForm, country);
  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(false);
    setBlank(false);
    setErrorPass(false);
    setBlankPass(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleTracker = async (): Promise<void> => {
    await dispatch(fetchUserData());
    await dispatch(fetchExpData());
    const responseUser = await getUserInfo();
    TrackerEvent({
      event: 'SW_auth_login',
      userData: responseUser
    });
    if (isQuery) {
      await withRedirect(router, router.query);
    } else {
      await router.push('/homepage');
      TrackerEvent({
        event: `SW_homepage_page`,
        userData: responseUser
      });
    }
  };

  const handleRegister = async (): Promise<void> => {
    const response = await checkPhoneNumber(formattedData.phoneNumber);
    if (response === undefined && passTest) {
      setGuest('register');
      await handleGetOTP(method, setCountdown, setSelect, formattedData);
    }
  };

  const handleNext = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await validateSetupPassword(formattedData.phoneNumber);
      if (
        formattedData.phoneNumber.length ===
        countries[country].dialCode.replace('+', '').length
      ) {
        setError(true);
        setBlank(true);
        throw new Error();
      }
      if (response.is_need_set_password === true && passTest) {
        setGuest('guest-normal-register');
        await handleGetOTP(method, setCountdown, setSelect, formattedData);
        await forgotPassword({
          phoneNumber: formattedData.phoneNumber,
          oldPassword: formData.password,
          password: formData.password
        });
      } else if (response.is_need_set_password === false && passTest) {
        const response = await loginPhoneNumber(loginForm);
        if (response.status === 200) {
          AuthLocalStorage(response);
          await handleTracker();
        } else if (
          response?.data?.message === 'wrong phone number or password'
        ) {
          setError(true);
          setErrorPass(true);
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.message === 'sql: no rows in result set') {
        await handleRegister();
      }
    } finally {
      setLoading(false);
    }
    if (formData.password === '') {
      setErrorPass(true);
      setBlankPass(true);
    } else if (!passTest) {
      setErrorPass(true);
    }
  };

  useEffect(() => {
    setLoginForm({
      ...loginForm,
      phoneNumber:
        guest === 'guest-normal-register'
          ? otpForm.phoneNumber
          : formattedData.phoneNumber,
      password: formData.password
    });
    if (data === undefined || data === null) {
      setFormData({
        ...formData,
        phoneNumber: formattedData.phoneNumber,
        name: formattedData.name !== undefined ? formattedData.name : ''
      });
    }
  }, [formattedData.phoneNumber, formData.password, formattedData.name]);

  return (
    <div
      className={`${className} flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4`}
    >
      <Image
        src={Backward}
        alt="Backward"
        className="absolute left-5 top-5 cursor-pointer"
        onClick={async () => {
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
        {t('authLogin.title2')}
      </Typography>
      <div className="w-full">
        <AuthNumber
          name="phoneNumber"
          country={country}
          countries={countries}
          setCountry={setCountry}
          formData={otpForm}
          setFormData={setOTPForm}
          handleChange={handleChangePhoneNumber}
          error={error}
          setError={setError}
          handleSubmit={async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {error && errorPass ? (
            <br />
          ) : error && blank ? (
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
          value={formData.password}
          error={errorPass}
          name="password"
          label={t('authLogin.createPassword').toString()}
          placeholder={t('authLogin.passwordPlaceholder').toString()}
          handleSubmit={async (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {error && errorPass ? (
            t('authLogin.validation.login')
          ) : errorPass && blankPass ? (
            t('authLogin.validation.blank')
          ) : errorPass ? (
            t('authLogin.validation.password')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <Link href={'/auth/forgot-password'} className="self-end">
        <Typography className="flex font-poppins font-semibold text-xs text-[#3AC4A0] ">
          {t('authLogin.forgotPass')}
        </Typography>
      </Link>
      <Button
        disabled={isLoading}
        onClick={handleNext}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] rounded-full w-full"
      >
        {isLoading ? <Spinner className=" h-6 w-6" /> : t('authLogin.next')}
      </Button>
      <AuthSSO setSelect={setSelect} setGuest={setGuest} />
    </div>
  );
};

export default AuthVerification;
