import SeedyDelete from '@/assets/auth/SeedyDelete.svg';
import close from '@/assets/more-option/close.svg';
import { deleteAccount } from '@/repository/profile.repository';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
interface IFormModalDelete {
  open: boolean;
  handleOpen: () => void;
}

const FormModalDelete: React.FC<IFormModalDelete> = ({
  open,
  handleOpen
}: IFormModalDelete) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    handleOpen();
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('keepMeLoggedIn');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('expiresAt');
    window.localStorage.removeItem('isBannerOpen');
    await signOut();
    await router.push('/');
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await deleteAccount();
      await handleLogout();
    } catch (error: any) {
      toast(error, { type: 'error' });
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

      <DialogBody className="flex flex-col items-center gap-6 p-0 w-full">
        <Image src={SeedyDelete} alt="SeedyDelete" />
        <div className="flex flex-col gap-2 items-center">
          <Typography className="font-poppins font-semibold text-base text-[#262626] text-center">
            {t('setting.setting.accountSecure.delete.title1')}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
            {t('setting.setting.accountSecure.delete.title2')}
          </Typography>
        </div>
        <Button
          onClick={handleSubmit}
          className="font-poppins font-semibold text-sm text-white capitalize w-full bg-[#DD2525] rounded-full"
        >
          {t('setting.setting.accountSecure.delete.yes')}
        </Button>
        <Button
          onClick={handleOpen}
          className="font-poppins font-semibold text-sm text-[#7555DA] capitalize w-full bg-white rounded-full"
        >
          {t('setting.setting.accountSecure.delete.no')}
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export default FormModalDelete;
