import Backward from '@/assets/auth/Backward.svg';
import SeedyAuthLogin from '@/assets/auth/SeedyAuthLogin.png';
import withRedirect from '@/helpers/withRedirect';
import { checkSeedsTag } from '@/repository/auth.repository';
import { Button, Typography } from '@material-tailwind/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthBoD from './AuthBoD';
import AuthCommonInput from './AuthCommonInput';
import AuthRef from './AuthRef';

interface IAuthPersonalData {
  className: string;
  setFormData: any;
  formData: any;
  loginForm: {
    phoneNumber: string;
    password: string;
    platform: string;
    os_name: string;
  };
  setSelect: (value: number) => void;
}

const AuthPersonalData: React.FC<IAuthPersonalData> = ({
  className,
  setFormData,
  formData,
  loginForm,
  setSelect
}: IAuthPersonalData) => {
  const router = useRouter();
  const { data } = useSession();
  const { t } = useTranslation();
  const regex = /[^a-zA-Z0-9]/g;
  const [open, setOpen] = useState(false);
  const [errorTag, setErrorTag] = useState(false);
  const [errorRegex, setErrorRegex] = useState(false);
  const [errorDoB, setErrorDoB] = useState(false);
  const [blank, setBlank] = useState(false);
  const [blankTag, setBlankTag] = useState(false);
  const [blankDoB, setBlankDoB] = useState(false);
  const [day, setDay] = useState<number | undefined>(
    data !== null ? new Date().getDate() : undefined
  );
  const [month, setMonth] = useState<number | undefined>(
    data !== null ? new Date().getMonth() : undefined
  );

  const [year, setYear] = useState<number | undefined>(
    data !== null ? new Date().getFullYear() - 17 : undefined
  );

  const timezoneOffset = new Date().getTimezoneOffset();
  const utcDate = new Date(
    `${typeof year === 'number' ? year : ''}/${
      typeof month === 'number' ? month + 1 : ''
    }/${typeof day === 'number' ? day : ''}`
  );
  const birthLimit =
    (new Date().getTime() -
      new Date(
        `${typeof year === 'number' ? year : ''}/${
          typeof month === 'number' ? month : ''
        }/${typeof day === 'number' ? day : ''}`
      ).getTime()) /
    (1000 * 60 * 60 * 24 * 365.25);
  const handleOpen = (): void => {
    setOpen(!open);
  };
  const handleNext = async (): Promise<void> => {
    try {
      if (data !== null) {
        setFormData({ ...formData, password: '', phoneNumber: '' });
      }
      if (
        formData.name.length === 0 ||
        formData.seedsTag.length === 0 ||
        errorRegex ||
        birthLimit < 12 ||
        day === undefined ||
        month === undefined ||
        year === undefined
      ) {
        if (formData.name.length === 0) {
          setBlank(true);
        }
        if (formData.seedsTag.length === 0) {
          setErrorTag(true);
          setBlankTag(true);
        }
        if (birthLimit < 12) {
          setErrorDoB(true);
        }
        if (day === undefined || month === undefined || year === undefined) {
          setErrorDoB(true);
          setBlankDoB(true);
        }
        await checkSeedsTag(formData.seedsTag);
        throw new Error('something error');
      } else {
        await checkSeedsTag(formData.seedsTag);
        handleOpen();
      }
    } catch (error: any) {
      toast(error, { type: 'error' });
      if (
        error.response?.data?.message === 'requested seeds tag already exists'
      ) {
        setErrorTag(true);
      }
    }
  };

  const handleChange = (e: any): void => {
    setBlank(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleChangeTag = (e: any): void => {
    setErrorTag(false);
    setBlankTag(false);
    setErrorRegex(false);
    const updatedForm = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedForm);
    setErrorRegex(regex.test(updatedForm.seedsTag));
  };

  const handleChangeDoB = (e: any): void => {
    const date = new Date(
      utcDate.getTime() - (timezoneOffset - 20) * 60 * 1000
    ).toISOString();
    setErrorDoB(false);
    setBlankDoB(false);
    setFormData({
      ...formData,
      birthDate: date
    });
  };

  return (
    <div
      className={`${className} flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4`}
    >
      <Image
        src={Backward}
        alt="Backward"
        className="absolute left-5 top-5 cursor-pointer"
        onClick={async () => {
          if (data !== null) {
            setFormData({ ...formData, name: '', seedsTag: '' });
            await withRedirect(router, router.query, '/auth');
            await signOut();
          } else {
            setSelect(0);
          }
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
        {t('authRegister.authPersonalData.title')}
      </Typography>
      <div className="w-full">
        <AuthCommonInput
          handleChange={handleChange}
          name="name"
          formData={formData.name}
          placeholder={t('authRegister.authPersonalData.namePlaceholder')}
          label={t('authRegister.authPersonalData.name')}
          type="text"
          error={blank}
          required={true}
          handleSubmit={async (e: any) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {blank ? t('authLogin.validation.blank') : <br />}
        </Typography>
      </div>
      <div className="w-full">
        <AuthCommonInput
          handleChange={handleChangeTag}
          name="seedsTag"
          formData={formData.seedsTag}
          placeholder="Ex: Seeds123"
          label="Seeds Tag"
          type="text"
          error={errorTag || errorRegex}
          required={true}
          handleSubmit={async (e: any) => {
            if (e.key === 'Enter') {
              await handleNext();
            }
          }}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {blankTag && errorTag ? (
            t('authLogin.validation.blank')
          ) : errorRegex ? (
            t('authRegister.authPersonalData.validation.regex')
          ) : errorTag ? (
            t('authRegister.authPersonalData.validation.seedsTag')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <div className="w-full">
        <AuthBoD
          error={errorDoB}
          day={day}
          setDay={setDay}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          handleChangeDoB={handleChangeDoB}
        />
        <Typography className="font-poppins font-light text-sm text-[#DD2525] self-start ps-4">
          {blankDoB && errorDoB ? (
            t('authLogin.validation.blank')
          ) : errorDoB ? (
            t('authRegister.authPersonalData.validation.dob')
          ) : (
            <br />
          )}
        </Typography>
      </div>
      <AuthRef
        open={open}
        handleOpen={handleOpen}
        setFormData={setFormData}
        formData={formData}
        loginForm={loginForm}
      />

      <Button
        onClick={handleNext}
        className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] rounded-full w-full"
      >
        {t('authLogin.next')}
      </Button>
    </div>
  );
};

export default AuthPersonalData;
