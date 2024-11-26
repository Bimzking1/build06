import PenMail from '@/assets/auth/PenMail.svg';
import SeedyMail from '@/assets/auth/SeedyMail.png';
import close from '@/assets/more-option/close.svg';
import AuthCommonInput from '@/components/auth/AuthCommonInput';
import { checkEmail } from '@/repository/auth.repository';
import { editUserInfo } from '@/repository/profile.repository';
import { useAppSelector } from '@/store/redux/store';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalPrevent from './ModalPrevent';
interface IFormModalMail {
  open: boolean;
  handleOpen: () => void;
  emailData: string;
  setOpenMail: React.Dispatch<React.SetStateAction<boolean>>;
  openMail: boolean;
}

interface IForm {
  name: string;
  seedsTag: string;
  email: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
}
const FormModalMail: React.FC<IFormModalMail> = ({
  open,
  handleOpen,
  emailData,
  setOpenMail,
  openMail
}: IFormModalMail) => {
  const { dataUser } = useAppSelector(state => state.user);
  const [error, setError] = useState(false);
  const [openVerifyMail, setVerifyMail] = useState(false);

  const { t } = useTranslation();
  const [formData, setFormData] = useState<IForm>({
    name: dataUser.name,
    seedsTag: dataUser.seedsTag,
    email: '',
    avatar: dataUser.avatar,
    bio: dataUser.bio,
    birthDate: dataUser.birthDate,
    phone: dataUser.phoneNumber
  });
  const handleOpenVerify = (): void => {
    setVerifyMail(!openVerifyMail);
  };
  const handleChange = (e: any): void => {
    setError(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    try {
      await checkEmail(formData.email);
      setOpenMail(!openMail);
      handleOpenVerify();
      const updatedForm: IForm = { ...formData };
      await editUserInfo(updatedForm);
    } catch (error: any) {
      setError(true);
      console.error(error.response.data.message);
    }
  };
  return (
    <>
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
          <Image src={SeedyMail} alt="SeedyMail" className="w-52 h-52" />
          <div className="flex flex-col gap-2 items-center">
            <Typography className="font-poppins font-semibold text-xl text-[#262626] text-center">
              {emailData !== ''
                ? t('setting.setting.accountSecure.titleChangeMail1')
                : t('setting.setting.accountSecure.titleMail1')}
            </Typography>
            <Typography className="font-poppins font-light text-base text-[#7C7C7C] text-center">
              {emailData !== ''
                ? t('setting.setting.accountSecure.titleChangeMail2')
                : t('setting.setting.accountSecure.titleMail2')}
            </Typography>
          </div>
          <div className="w-full relative">
            <AuthCommonInput
              label="Email"
              type="email"
              placeholder={t('setting.setting.accountSecure.placeholderMail')}
              required={false}
              name="email"
              formData={formData.email}
              handleChange={handleChange}
              error={error}
              handleSubmit={async (e: any) => {
                if (e.key === 'Enter') {
                  await handleSubmit(e);
                }
              }}
            />
            <Image
              src={PenMail}
              alt="PenMail"
              className="absolute right-[14px] top-[14px]"
            />
            <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
              {error ? (
                t('setting.setting.accountSecure.validationEmail')
              ) : (
                <br />
              )}
            </Typography>
          </div>

          <Button
            disabled={formData.email === ''}
            onClick={handleSubmit}
            className="font-poppins font-semibold text-base text-white capitalize w-full bg-[#3AC4A0] rounded-full disabled:bg-[#DADADA]"
          >
            {t('setting.setting.accountSecure.confirm')}
          </Button>
        </DialogBody>
      </Dialog>
      <ModalPrevent
        open={openVerifyMail}
        handleOpen={handleOpenVerify}
        text={t('authForgotPass.modal.title3')}
      />
    </>
  );
};

export default FormModalMail;
