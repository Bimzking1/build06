import Backward from '@/assets/auth/Backward.svg';
import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import AuthNumber from '@/components/auth/AuthNumber';
import AuthPassword from '@/components/auth/AuthPassword';
import countries from '@/constants/countries.json';
import TrackerEvent from '@/helpers/GTM';
import withRedirect from '@/helpers/withRedirect';
import { loginPhoneNumber } from '@/repository/auth.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { fetchExpData } from '@/store/redux/features/exp';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch } from '@/store/redux/store';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import DeviceDetector from 'device-detector-js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthSSO from './AuthSSO';

interface FormData {
  phoneNumber: string;
  password: string;
  platform: string;
  os_name: string;
}

const AuthLogin: React.FC = () => {
  const setSelect = (): number => {
    return 2;
  };
  const router = useRouter();
  const isQuery = Object.keys(router.query).length > 0;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const deviceDetector = new DeviceDetector();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(101);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    password: '',
    platform: '',
    os_name: ''
  });

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const formattedPhone = {
        ...formData,
        phoneNumber: `${countries[country].dialCode.replace('+', '')}${
          formData.phoneNumber
        }`
      };
      const response = await loginPhoneNumber(formattedPhone);
      if (response.status === 200) {
        window.localStorage.setItem('accessToken', response.accessToken);
        window.localStorage.setItem('refreshToken', response.refreshToken);
        window.localStorage.setItem('expiresAt', response.expiresAt);
        window.localStorage.setItem('isBannerOpen', 'true');
        window.localStorage.removeItem('isGuest');

        setFormData({ ...formData, phoneNumber: '', password: '' });
        await dispatch(fetchUserData());
        await dispatch(fetchExpData());
        const responseUser = await getUserInfo();
        TrackerEvent({
          event: 'Seeds_login_web',
          userId: responseUser.id
        });
        if (isQuery) {
          await withRedirect(router, router.query);
        } else {
          await router.push('/homepage');
          TrackerEvent({
            event: `Seeds_view_home_page_web`,
            userId: responseUser.id,
            pageName: 'homepage'
          });
        }
      } else if (response.data.message === 'wrong phone number or password') {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
      setLoading(false);
      setError(true);
    }
  };

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

  useEffect(() => {
    setFormData({
      ...formData,
      platform: `${
        deviceDetector.parse(navigator.userAgent).device?.type as string
      }_web`,
      os_name: `${deviceDetector.parse(navigator.userAgent).os?.name as string}`
    });
  }, []);

  return (
    <div className="flex flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4">
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
            await handleSubmit();
          }
        }}
      />
      <div className="w-full">
        <AuthPassword
          handleChange={handleChange}
          formData={formData.password}
          error={error}
          name="password"
          label={t('authLogin.password').toString()}
          placeholder={t('authLogin.passwordPlaceholder').toString()}
          handleSubmit={async (e: any) => {
            if (e.key === 'Enter') {
              await handleSubmit();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {error ? t('authLogin.validation.login') : <br />}
        </Typography>
      </div>
      <Link href={'/auth/forgot-password'} className="self-end">
        <Typography className="flex font-poppins font-semibold text-xs text-[#3AC4A0] ">
          {t('authLogin.forgotPass')}
        </Typography>
      </Link>
      <Button
        disabled={loading}
        onClick={handleSubmit}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] rounded-full w-full"
      >
        {loading ? <Spinner className=" h-6 w-6" /> : t('authLogin.login')}
      </Button>
      <AuthSSO setSelect={setSelect} />
    </div>
  );
};

export default AuthLogin;
