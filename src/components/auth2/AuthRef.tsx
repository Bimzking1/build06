import SeedyAuthRef from '@/assets/auth/SeedyAuthRef.png';
import Toast from '@/containers/circle/[id]/Toast';
import { AuthLocalStorage } from '@/helpers/authLocalStorage';
import TrackerEvent from '@/helpers/GTM';
import withRedirect from '@/helpers/withRedirect';
import {
  checkRefCode,
  editGuestInfo,
  loginPhoneNumber,
  loginSSO,
  register
} from '@/repository/auth.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { fetchExpData } from '@/store/redux/features/exp';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch } from '@/store/redux/store';
import type { AuthRefI } from '@/utils/interfaces/auth.interface';
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
import AuthCommonInput from './AuthCommonInput';

const AuthRef: React.FC<AuthRefI> = ({
  open,
  handleOpen,
  setFormData,
  formData,
  loginForm,
  guest
}: AuthRefI) => {
  const dispatch = useAppDispatch();
  const { data } = useSession();
  const { t } = useTranslation();
  const [loadingSkip, setLoadingSkip] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isQuery = Object.keys(router.query).length > 0;
  const [error, setError] = useState(false);
  const [openToast, setOpenToast] = useState<{ status: boolean; text: string }>(
    { status: false, text: '' }
  );

  const handleTracker = async (): Promise<void> => {
    await dispatch(fetchUserData());
    await dispatch(fetchExpData());
    const responseUser = await getUserInfo();
    TrackerEvent({
      event: 'SW_auth_login',
      userData: responseUser
    });
    handleOpen();
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

  const handleSubmit = async (): Promise<void> => {
    try {
      if (data !== null && data !== undefined) {
        const SSOresponse = await loginSSO({
          identifier: data.accessToken,
          provider: data.provider
        });
        AuthLocalStorage(SSOresponse);
        await handleTracker();
      } else {
        const response = await loginPhoneNumber(loginForm);
        AuthLocalStorage(response);
        await handleTracker();
      }
    } catch (error: any) {
      setLoading(false);
      setLoadingSkip(false);
      setOpenToast({
        status: true,
        text: error?.response?.data?.message
      });
    }
  };

  const handleSkip = async (): Promise<void> => {
    try {
      setLoadingSkip(true);
      if (guest === 'guest-normal-register') {
        const response = await editGuestInfo(formData);
        if (response === null) {
          throw new Error(response);
        }
      } else if (guest === 'register') {
        const response = await register(formData);
        if (response === null) {
          throw new Error(response);
        }
      }
      await handleSubmit();
      setError(false);
    } catch (error: any) {
      setOpenToast({
        status: true,
        text: error?.response?.data?.message
      });
      setLoadingSkip(false);
    } finally {
      setLoadingSkip(false);
    }
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      setLoading(true);
      await checkRefCode(formData.refCode);
      if (guest === 'guest-normal-register') {
        const response = await editGuestInfo(formData);
        if (response === null) {
          throw new Error(response);
        }
      } else if (guest === 'register') {
        const response = await register(formData);
        if (response === null) {
          throw new Error(response);
        }
      }
      await handleSubmit();
      setError(false);
    } catch (error: any) {
      setOpenToast({ status: true, text: error?.response?.data?.message });
      setLoading(true);
      setError(true);
      setFormData(prev => ({ ...prev, refCode: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      className="flex flex-col items-center rounded-3xl min-w-full"
      dismiss={{ enabled: !(loading || loadingSkip) }}
    >
      <Toast
        message={openToast.text}
        show={openToast.status}
        onClose={() => {
          setOpenToast({ ...openToast, status: false });
        }}
      />
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
            handleSubmit={async (e: React.KeyboardEvent<HTMLInputElement>) => {
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
            disabled={loading || loadingSkip}
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
            disabled={loading || loadingSkip}
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
