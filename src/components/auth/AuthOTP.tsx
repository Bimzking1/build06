import Backward from '@/assets/auth/Backward.svg';
import { editVerifyOtp, getOtp, verifyOtp } from '@/repository/auth.repository';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch } from '@/store/redux/store';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface IAuthOTP {
  select: number;
  number: string;
  method: any;
  setMethod: any;
  getOTP: any;
  countdown: any;
  setCountdown: any;
  setSelect: any;
  image: any;
  formData: any;
  setFormData: any;
}

const AuthOTP: React.FC<IAuthOTP> = ({
  select,
  number,
  method,
  setMethod,
  getOTP,
  countdown,
  setCountdown,
  setSelect,
  image,
  formData,
  setFormData
}: IAuthOTP) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [input, setInput] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [blank, setBlank] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const OTP = input.join('');
  const verifyOTP = {
    method,
    msisdn: number,
    otp: OTP
  };

  const handleChangeOTP = (index: number, value: string): void => {
    setBlank(false);
    setError(false);
    const newInput = [...input];
    newInput[index] = value.replace(/\D/g, '');
    const isReplaced = new RegExp(value).test(value);
    const isLetter = /\D/g.test(value);
    setInput(newInput);
    if (newInput[index] !== '') {
      inputRefs.current[index + 1]?.focus();
    } else if (isReplaced && isLetter) {
      inputRefs.current[index]?.focus();
    } else if (newInput[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleMethodChange = async (): Promise<void> => {
    setBlank(false);
    setError(false);
    setInput(['', '', '', '']);
    const newMethod = method === 'whatsapp' ? 'sms' : 'whatsapp';
    await getOtp({ method: newMethod, phoneNumber: number });
    setMethod(newMethod);
    setCountdown(60);
    inputRefs.current[0]?.focus();
  };

  const handleSubmitOTP = async (event: any): Promise<void> => {
    event.preventDefault();
    try {
      if (OTP.length === 0) {
        setBlank(true);
        setError(true);
        setInput(['', '', '', '']);
        inputRefs.current[0]?.focus();
        throw new Error(`${t('authLogin.validation.blank')}`);
      } else {
        if (localStorage.getItem('accessToken') !== null) {
          await editVerifyOtp(verifyOTP);
        } else {
          await verifyOtp(verifyOTP);
        }

        if (window.location.pathname !== '/auth/change-phone-number') {
          setSelect(2);
        } else {
          await dispatch(fetchUserData());
          router.back();
        }
        setCountdown(0);
      }
    } catch (error: any) {
      toast(error ?? error.response.data.message, { type: 'error' });

      setError(true);
      setInput(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [select === 1]);

  return (
    <>
      <div
        className={`${
          select === 1 ? 'flex' : 'hidden'
        } flex-col md:w-[78%] w-full items-center md:gap-8 gap-6 md:p-8 p-4`}
      >
        <Image
          src={Backward}
          alt="Backward"
          className="absolute left-5 top-5 cursor-pointer"
          onClick={() => {
            if (window.location.pathname !== '/auth/change-phone-number') {
              setMethod('sms');
              setFormData({ ...formData, phoneNumber: '', password: '' });
              setSelect(0);
            } else {
              router.back();
            }
          }}
        />
        <Image
          src={image}
          alt="SeedyAuthLogin"
          className="w-[141.8px] md:flex hidden"
        />
        <Typography className="w-full font-poppins font-normal md:text-xl text-sm text-[#7C7C7C] pt-10 md:p-0">
          <span className="font-poppins font-semibold md:text-2xl text-base text-[#050522]">
            {t('authRegister.authOTP.title1')}
          </span>
          <br />
          {t('authRegister.authOTP.title2')}
          {method === 'whatsapp' ? 'Whatsapp' : 'SMS'}
          {t('authRegister.authOTP.title3')} +{formData.phoneNumber}.
        </Typography>
        <div className="w-full">
          <div className="flex justify-center gap-[150px] md:mb-8 mb-6">
            <Button
              onClick={async () => {
                setBlank(false);
                setError(false);
                setInput(['', '', '', '']);
                inputRefs.current[0]?.focus();
                await getOtp(getOTP);
                setCountdown(60);
              }}
              disabled={countdown > 0}
              className="capitalize bg-transparent shadow-none hover:shadow-none p-0 text-sm disabled:text-[#7C7C7C] text-[#3AC4A0] font-semibold font-poppins"
            >
              {t('authRegister.authOTP.resend')}
            </Button>
            <Typography className="font-poppins font-normal text-base text-[#7C7C7C]">
              {countdown === 60
                ? '01:00'
                : `00:${countdown < 10 ? '0' : ''}${countdown as string}`}
            </Typography>
          </div>
          <div className="flex justify-center w-full gap-6">
            {input.map((value, index) => (
              <div
                className={`rounded-[10px] p-[2px] w-16 h-16 ${
                  error
                    ? 'bg-[#FF3838]'
                    : 'bg-gradient-to-l from-[#97A4E7] to-[#47C0AA]'
                }`}
                key={index}
              >
                <input
                  type="text"
                  key={index}
                  ref={el => {
                    if (el !== null) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  value={value}
                  maxLength={1}
                  onKeyDown={async (e: any) => {
                    if (e.key === 'Enter') {
                      await handleSubmitOTP(event);
                    }
                  }}
                  onChange={e => {
                    handleChangeOTP(index, e.target.value);
                  }}
                  className=" w-full h-full focus:outline-none p-0 rounded-[8px] text-center text-[#262626] text-base font-semibold font-poppins [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
          <Typography className="font-poppins font-light text-sm text-[#DD2525] text-center mt-2">
            {error && blank ? (
              t('authLogin.validation.blank')
            ) : error ? (
              t('authRegister.authOTP.validation')
            ) : (
              <br />
            )}
          </Typography>
        </div>
        <div className="flex flex-col items-center">
          <Typography className="font-poppins font-medium text-sm text-[#BDBDBD]">
            {t('authRegister.authOTP.otherMethod1')}
          </Typography>
          <Button
            className="capitalize bg-transparent shadow-none hover:shadow-none p-0 text-sm disabled:text-[#7C7C7C] text-[#3AC4A0] font-semibold font-poppins"
            onClick={handleMethodChange}
            disabled={countdown > 0}
          >
            {t('authRegister.authOTP.otherMethod3')}
            <span className="lowercase">
              {t('authRegister.authOTP.otherMethod4')}
            </span>
            {`${method === 'whatsapp' ? ' SMS' : ' Whatsapp'}`}
          </Button>
        </div>

        <Button
          onClick={handleSubmitOTP}
          className="flex justify-center font-semibold font-poppins text-base text-white capitalize bg-[#3AC4A0] rounded-full w-full"
        >
          {t('authLogin.next')}
        </Button>
      </div>
    </>
  );
};

export default AuthOTP;
