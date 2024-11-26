import Backward from '@/assets/auth/Backward.svg';
import Info from '@/assets/auth/Info.png';
import SeedyLock from '@/assets/auth/SeedyLock.png';
import AuthPassword from '@/components/auth/AuthPassword';
import { changePassword, forgotPassword } from '@/repository/auth.repository';
import { useAppSelector } from '@/store/redux/store';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface IPasswordForm {
  formData: any;
  setFormData: any;
}

const PasswordForm: React.FC<IPasswordForm> = ({
  formData,
  setFormData
}: IPasswordForm) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { dataUser } = useAppSelector(state => state.user);
  const [errorPass, setErrorPass] = useState(false);
  const [errorOldPass, setErrorOldPass] = useState(false);
  const [errorRepass, setErrorRepass] = useState(false);
  const [repass, setRepass] = useState({ repass: '' });
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const handlePass = (e: any): void => {
    setErrorPass(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleOldPass = (e: any): void => {
    setErrorOldPass(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRepass = (e: any): void => {
    setErrorRepass(false);
    setRepass({ ...repass, [e.target.name]: e.target.value });
  };

  const handleNext = async (): Promise<void> => {
    try {
      const passTest = regex.test(formData.password);
      if (!passTest) {
        setErrorPass(true);
        throw new Error(`${t('authForgotPass.validation.password')}`);
      }
      if (dataUser.isPasswordExists) {
        await changePassword(formData);
      } else {
        if (formData.password !== repass.repass) {
          setErrorRepass(true);
          throw new Error(`${t('authForgotPass.validation.match')}`);
        }
        if (passTest && formData.password === repass.repass) {
          await forgotPassword(formData);
        }
      }
      await router.push('/user-setting/account-security-center');
    } catch (error: any) {
      if (error.message === 'Request failed with status code 401') {
        setErrorOldPass(true);
      }
      toast(error.message, { type: 'error' });
    }
  };

  return (
    <div className="flex flex-col w-full items-center md:gap-8 gap-6 md:py-8 md:px-20 p-4">
      <Image
        src={Backward}
        alt="Backward"
        className="absolute left-5 top-5 cursor-pointer"
        onClick={() => {
          router.back();
        }}
      />
      <Image src={SeedyLock} alt="SeedyLock" className="w-32 md:flex hidden" />
      <Typography className="w-full font-poppins font-semibold md:text-2xl text-base text-[#050522] md:text-center pt-10 md:p-0">
        {dataUser.isPasswordExists
          ? t('setting.setting.accountSecure.settingPassword.title3')
          : t('setting.setting.accountSecure.settingPassword.title1')}
        <br />
        <span className="font-poppins font-normal md:text-xl text-sm text-[#7C7C7C]">
          {dataUser.isPasswordExists
            ? t('setting.setting.accountSecure.settingPassword.title4')
            : t('setting.setting.accountSecure.settingPassword.title2')}
        </span>
      </Typography>
      {dataUser.isPasswordExists ? (
        <>
          <div className="w-full">
            <AuthPassword
              handleChange={handleOldPass}
              formData={formData.oldPassword}
              error={errorOldPass}
              name="oldPassword"
              label={t(
                'setting.setting.accountSecure.settingPassword.oldPassword.label'
              )}
              placeholder={t(
                'setting.setting.accountSecure.settingPassword.oldPassword.placeholder'
              )}
              handleSubmit={async (e: any) => {
                if (e.key === 'Enter') {
                  await handleNext();
                }
              }}
            />
            <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
              {errorOldPass ? (
                t(
                  'setting.setting.accountSecure.settingPassword.oldPassword.validation'
                )
              ) : (
                <br />
              )}
            </Typography>
          </div>
          <div className="w-full">
            <AuthPassword
              handleChange={handlePass}
              formData={formData.password}
              error={errorPass}
              name="password"
              label={t(
                'setting.setting.accountSecure.settingPassword.newPassword.label'
              )}
              placeholder={t(
                'setting.setting.accountSecure.settingPassword.newPassword.placeholder'
              )}
              handleSubmit={async (e: any) => {
                if (e.key === 'Enter') {
                  await handleNext();
                }
              }}
            />
            <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
              {errorPass ? (
                t(
                  'setting.setting.accountSecure.settingPassword.newPassword.validation'
                )
              ) : (
                <br />
              )}
            </Typography>
          </div>
        </>
      ) : (
        <>
          <div className="w-full">
            <AuthPassword
              handleChange={handlePass}
              formData={formData.password}
              error={errorPass}
              name="password"
              label={t(
                'setting.setting.accountSecure.settingPassword.createPassword.label'
              )}
              placeholder={t(
                'setting.setting.accountSecure.settingPassword.createPassword.placeholder'
              )}
              handleSubmit={async (e: any) => {
                if (e.key === 'Enter') {
                  await handleNext();
                }
              }}
            />
            <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
              {errorPass ? t('authForgotPass.validation.password') : <br />}
            </Typography>
          </div>
          <div className="w-full">
            <AuthPassword
              handleChange={handleRepass}
              formData={repass.repass}
              error={errorRepass}
              name="repass"
              label={t(
                'setting.setting.accountSecure.settingPassword.matchPassword.label'
              )}
              placeholder={t(
                'setting.setting.accountSecure.settingPassword.matchPassword.placeholder'
              )}
              handleSubmit={async (e: any) => {
                if (e.key === 'Enter') {
                  await handleNext();
                }
              }}
            />
            <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
              {errorRepass ? t('authForgotPass.validation.match') : <br />}
            </Typography>
          </div>
        </>
      )}
      <div className="flex gap-3 self-start">
        <Image src={Info} alt="Info" className="w-5 h-5" />
        <Typography className="font-poppins font-light text-sm text-[#3AC4A0]">
          {t('authForgotPass.information')}
        </Typography>
      </div>
      <Button
        onClick={handleNext}
        disabled={
          dataUser.isPasswordExists
            ? formData.password.length === 0 ||
              formData.oldPassword.length === 0
            : formData.password.length === 0 || repass.repass.length === 0
        }
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] disabled:bg-[#BDBDBD] rounded-full w-full"
      >
        {t('authLogin.next')}
      </Button>
    </div>
  );
};

export default PasswordForm;
