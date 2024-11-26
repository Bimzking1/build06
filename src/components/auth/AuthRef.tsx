import SeedyAuthRef from '@/assets/auth/SeedyAuthRef.png';
import TrackerEvent from '@/helpers/GTM';
import withRedirect from '@/helpers/withRedirect';
import {
  checkRefCode,
  loginPhoneNumber,
  loginSSO,
  register
} from '@/repository/auth.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { fetchExpData } from '@/store/redux/features/exp';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch } from '@/store/redux/store';
import {
  Button,
  Dialog,
  DialogBody,
  Spinner,
  Typography
} from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthCommonInput from './AuthCommonInput';

interface IAuthRef {
  open: boolean;
  handleOpen: any;
  setFormData: any;
  formData: any;
  loginForm: {
    phoneNumber: string;
    password: string;
    platform: string;
    os_name: string;
  };
}

const AuthRef: React.FC<IAuthRef> = ({
  open,
  handleOpen,
  setFormData,
  formData,
  loginForm
}: IAuthRef) => {
  const dispatch = useAppDispatch();
  const { data } = useSession();
  const { t } = useTranslation();
  const [loadingSkip, setLoadingSkip] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isQuery = Object.keys(router.query).length > 0;
  const [error, setError] = useState(false);

  const handleTracker = async (): Promise<void> => {
    await dispatch(fetchUserData());
    await dispatch(fetchExpData());
    const responseUser = await getUserInfo();
    TrackerEvent({
      event: 'Seeds_login_web',
      userId: responseUser.id
    });
    handleOpen();
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
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await loginPhoneNumber(loginForm);
      if (data !== null) {
        const SSOresponse = await loginSSO({
          identifier: data.accessToken,
          provider: data.provider
        });
        window.localStorage.setItem('accessToken', SSOresponse.accessToken);
        window.localStorage.setItem('refreshToken', SSOresponse.refreshToken);
        window.localStorage.setItem('expiresAt', SSOresponse.expiresAt);
        window.localStorage.setItem('isBannerOpen', 'true');
        await handleTracker();
      } else if (response.status === 200) {
        window.localStorage.setItem('accessToken', response.accessToken);
        window.localStorage.setItem('refreshToken', response.refreshToken);
        window.localStorage.setItem('expiresAt', response.expiresAt);
        window.localStorage.setItem('isBannerOpen', 'true');
        setFormData({ ...formData, phoneNumber: '', password: '' });
        await handleTracker();
      } else if (response.data.message === 'wrong phone number or password') {
        setLoading(false);
        setLoadingSkip(false);
        setError(true);
      }
    } catch (error: any) {
      setLoading(false);
      setLoadingSkip(false);
      toast(error, { type: 'error' });
    }
  };

  const handleSkip = async (): Promise<void> => {
    try {
      setLoadingSkip(true);
      const response = await register(formData);
      if (response === null) {
        throw new Error(response);
      }
      await handleSubmit();
      setError(false);
    } catch (error: any) {
      setLoadingSkip(false);
      toast(error, { type: 'error' });
    }
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      setLoading(true);
      await checkRefCode(formData.refCode);
      const response = await register(formData);
      if (response === null) {
        throw new Error(response);
      }
      await handleSubmit();
      setError(false);
    } catch (error: any) {
      setLoading(true);
      toast(error, { type: 'error' });
      setError(true);
    }
  };

  const handleChange = (e: any): void => {
    setError(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      className="flex flex-col items-center rounded-3xl min-w-full"
    >
      <DialogBody className="flex flex-col gap-4 p-10 items-center">
        <Image src={SeedyAuthRef} alt="SeedyAuthRef" className="w-[242px]" />
        <div className="flex flex-col gap-2">
          <Typography className="text-center font-poppins font-semibold text-xl text-[#262626]">
            {t('authRegister.authRef.title1')}
          </Typography>
          <Typography className="text-center font-poppins font-light text-base text-[#7C7C7C]">
            {t('authRegister.authRef.title2')}
          </Typography>
        </div>
        <div className="w-full">
          <AuthCommonInput
            handleChange={handleChange}
            name="refCode"
            formData={formData.refCode}
            placeholder={t('authRegister.authRef.referralPlaceholder')}
            label={t('authRegister.authRef.referral')}
            type="text"
            error={error}
            required={false}
            handleSubmit={async (e: any) => {
              if (e.key === 'Enter') {
                await handleConfirm();
              }
            }}
          />
          <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
            {error ? t('authRegister.authRef.validation') : <br />}
          </Typography>
        </div>
        <div className="flex gap-4 w-full">
          <Button
            className="w-full flex justify-center capitalize font-poppins font-semibold text-sm text-[#3AC4A0] bg-[#E0E0E091] rounded-full"
            onClick={handleSkip}
            disabled={loading}
          >
            {loadingSkip ? (
              <Spinner className=" h-6 w-6" />
            ) : (
              t('authRegister.authRef.skip')
            )}
          </Button>
          <Button
            className="w-full flex justify-center capitalize font-poppins font-semibold text-sm text-white bg-[#3AC4A0] rounded-full"
            onClick={handleConfirm}
            disabled={loadingSkip}
          >
            {loading ? (
              <Spinner className=" h-6 w-6" />
            ) : (
              t('authRegister.authRef.confirm')
            )}
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default AuthRef;
