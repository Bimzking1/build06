import SeedyLock from '@/assets/auth/SeedyLock.png';
import close from '@/assets/more-option/close.svg';
import AuthPassword from '@/components/auth/AuthPassword';
import { loginPhoneNumber } from '@/repository/auth.repository';
import { deleteAccountProvider } from '@/repository/profile.repository';
import { useAppSelector } from '@/store/redux/store';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
interface IFormModalPassword {
  open: boolean;
  handleOpen: () => void;
  provider: string;
  setProviderList: any;
}

interface FormData {
  phoneNumber: string;
  password: string;
}
const FormModalPassword: React.FC<IFormModalPassword> = ({
  open,
  handleOpen,
  provider,
  setProviderList
}: IFormModalPassword) => {
  const { dataUser } = useAppSelector(state => state.user);
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: dataUser.phoneNumber,
    password: ''
  });

  const handleChange = (e: any): void => {
    setError(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await loginPhoneNumber(formData);
      if (response.status === 200) {
        setFormData({ ...formData, password: '' });
        await signOut();
        await deleteAccountProvider(provider);
        setProviderList([]);
      } else if (response.data.message === 'wrong phone number or password') {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
      setError(true);
    }
  };
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      className="p-4 md:p-8 flex flex-col items-center rounded-3xl min-w-full"
      dismiss={{ enabled: false }}
    >
      <Image
        src={close}
        alt="close"
        className="absolute right-4 top-4 md:right-8 md:top-8 cursor-pointer z-10"
        onClick={() => {
          handleOpen();
        }}
      />

      <DialogBody className="flex flex-col items-center gap-5 p-0 w-full">
        <Image src={SeedyLock} alt="SeedyLock" className="w-52 h-52" />
        <div className="flex flex-col gap-2 items-center">
          <Typography className="font-poppins font-semibold text-xl text-[#262626] text-center">
            {t('setting.setting.accountSecure.modalUnlink.title1')}
          </Typography>
          <Typography className="font-poppins font-light text-base text-[#7C7C7C] text-center">
            {t('setting.setting.accountSecure.modalUnlink.title2')}
          </Typography>
        </div>
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
            {error ? (
              t('setting.setting.accountSecure.modalUnlink.validation')
            ) : (
              <br />
            )}
          </Typography>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={formData.password === ''}
          className="font-poppins font-semibold text-base text-white capitalize w-full bg-[#3AC4A0] rounded-full disabled:bg-[#DADADA]"
        >
          {t('setting.setting.accountSecure.confirm')}
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export default FormModalPassword;
