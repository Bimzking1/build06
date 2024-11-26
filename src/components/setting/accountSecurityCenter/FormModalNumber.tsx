import SeedyAuthPass from '@/assets/auth/SeedyAuthPass.png';
import close from '@/assets/more-option/close.svg';
import countries from '@/constants/countries.json';
import { checkPhoneNumber, getOtp } from '@/repository/auth.repository';
import { editUserInfo } from '@/repository/profile.repository';
import { useAppSelector } from '@/store/redux/store';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SettingNumberInput from '../SettingNumberInput';
interface IFormModalNumber {
  open: boolean;
  handleOpen: () => void;
  phoneData: string;
  country: number;
  setCountry: React.Dispatch<React.SetStateAction<number>>;
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
const FormModalNumber: React.FC<IFormModalNumber> = ({
  open,
  handleOpen,
  phoneData,
  country,
  setCountry
}: IFormModalNumber) => {
  const router = useRouter();
  const { dataUser } = useAppSelector(state => state.user);
  const [error, setError] = useState(false);
  const [underSixDigit, setUnderSixDigit] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState<IForm>({
    name: dataUser.name,
    seedsTag: dataUser.seedsTag,
    email: dataUser.email,
    avatar: dataUser.avatar,
    bio: dataUser.bio,
    birthDate: dataUser.birthDate,
    phone: ''
  });
  const handleSubmitNumber = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (formData.phone.length < 6) {
        setUnderSixDigit(true);
        throw new Error(
          `${t('setting.setting.accountSecure.validationNumber2')}`
        );
      }
      const formattedPhone = {
        ...formData,
        phone: `${countries[country].dialCode.replace('+', '')}${
          formData.phone
        }`
      };
      await checkPhoneNumber(formattedPhone.phone);
      await editUserInfo(formattedPhone);
      await getOtp({ method: 'sms', phoneNumber: formattedPhone.phone });
      await router.push({
        pathname: '/auth/change-phone-number',
        query: {
          number: formData.phone,
          country
        }
      });
    } catch (error: any) {
      setError(true);
      toast(error.message ?? error?.response?.data?.message, { type: 'error' });
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dialCode: string
  ): void => {
    setUnderSixDigit(false);
    setError(false);
    if (formData.phone === dialCode) {
      setFormData({
        ...formData,
        phone: e.target.value.substring(dialCode.length)
      });
    } else if (formData.phone === '0') {
      setFormData({
        ...formData,
        phone: e.target.value.substring(1)
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <Image src={SeedyAuthPass} alt="SeedyAuthPass" className="w-52 h-52" />
        <div className="flex flex-col gap-2 items-center">
          <Typography className="font-poppins font-semibold text-xl text-[#262626]">
            {phoneData !== ''
              ? t('setting.setting.accountSecure.titleChangeNumber1')
              : t('setting.setting.accountSecure.titleNumber1')}
          </Typography>
          <Typography className="font-poppins font-light text-base text-[#7C7C7C]">
            {phoneData !== ''
              ? t('setting.setting.accountSecure.titleChangeNumber2')
              : t('setting.setting.accountSecure.titleNumber2')}
          </Typography>
        </div>
        <div className="w-full">
          <SettingNumberInput
            handleChange={handleChange}
            country={country}
            setCountry={setCountry}
            countries={countries}
            formData={formData.phone}
            name="phone"
            error={error}
            handleSubmit={async e => {
              if (e.key === 'Enter') {
                await handleSubmitNumber(e);
              }
            }}
          />
          <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
            {error && underSixDigit ? (
              t('setting.setting.accountSecure.validationNumber2')
            ) : error ? (
              t('setting.setting.accountSecure.validationNumber1')
            ) : (
              <br />
            )}
          </Typography>
        </div>

        <Button
          onClick={handleSubmitNumber}
          className="font-poppins font-semibold text-base text-white capitalize w-full bg-[#3AC4A0] rounded-full"
        >
          {t('setting.setting.accountSecure.confirm')}
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export default FormModalNumber;
