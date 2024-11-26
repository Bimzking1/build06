import Info from '@/assets/auth/Info.png';
import SeedyLock from '@/assets/auth/SeedyLock.png';
import AuthPassword from '@/components/auth/AuthPassword';
import { forgotPassword } from '@/repository/auth.repository';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface IAuthForgotPassNew {
  className: string;
  setSelect: any;
  formData: any;
  setFormData: any;
  handleOpen: any;
}

const AuthForgotPassNew: React.FC<IAuthForgotPassNew> = ({
  className,
  formData,
  setFormData,
  handleOpen
}: IAuthForgotPassNew) => {
  const { t } = useTranslation();
  const [errorPass, setErrorPass] = useState(false);
  const [errorRepass, setErrorRepass] = useState(false);
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const handlePass = (e: any): void => {
    setErrorPass(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRepass = (e: any): void => {
    setErrorRepass(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (): Promise<void> => {
    try {
      const passTest = regex.test(formData.password);
      if (!passTest) {
        setErrorPass(true);
        throw new Error(`${t('authForgotPass.validation.password')}`);
      }
      if (formData.password !== formData.oldPassword) {
        setErrorRepass(true);
        throw new Error(`${t('authForgotPass.validation.match')}`);
      }
      if (passTest && formData.password === formData.oldPassword) {
        await forgotPassword(formData);
        handleOpen();
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
    }
  };

  return (
    <div
      className={`${className} flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4`}
    >
      <Image
        src={SeedyLock}
        alt="SeedyLock"
        className="w-[141.8px] md:flex hidden"
      />
      <Typography className="w-full font-poppins font-semibold md:text-2xl text-base text-[#050522]">
        <span className="font-poppins font-normal md:text-xl text-sm text-[#7C7C7C]">
          {t('authForgotPass.title3')}
        </span>
        <br />
        {t('authForgotPass.title4')}
      </Typography>
      <div className="w-full">
        <AuthPassword
          handleChange={handlePass}
          formData={formData.password}
          error={errorPass}
          name="password"
          label={t('authForgotPass.newPassword.label')}
          placeholder={t('authForgotPass.newPassword.placeholder')}
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
          formData={formData.oldPassword}
          error={errorRepass}
          name="oldPassword"
          label={t('authForgotPass.matchPassword.label')}
          placeholder={t('authForgotPass.matchPassword.placeholder')}
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
      <div className="flex gap-3">
        <Image src={Info} alt="Info" className="w-5 h-5" />
        <Typography className="font-poppins font-light text-sm text-[#3AC4A0]">
          {t('authForgotPass.information')}
        </Typography>
      </div>
      <Button
        onClick={handleNext}
        disabled={
          formData.password.length === 0 || formData.oldPassword.length === 0
        }
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] disabled:bg-[#BDBDBD] rounded-full w-full"
      >
        {t('authLogin.next')}
      </Button>
    </div>
  );
};

export default AuthForgotPassNew;
