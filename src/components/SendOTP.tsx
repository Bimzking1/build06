import type { DefaultTFuncReturn } from 'i18next';
import Image from 'next/image';
import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  SendOTPEmail,
  SendOTPSms,
  SendOTPWhatsApp
} from 'public/assets/vector';

import Button from './ui/button/Button';
import CardGradient from './ui/card/CardGradient';
import Input from './ui/input/Input';

import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';

import ErrorBEContext from '@/store/error-be/error-be-context';
import LanguageContext from '@/store/language/language-context';
import OTPContext from '@/store/otp/otp-context';

interface SendOTPProps {
  message?: string | DefaultTFuncReturn;
  submessage?: ReactNode | DefaultTFuncReturn;
  target?: string;
}

const inputs = [1, 2, 3, 4];

const SendOTP: React.FC<SendOTPProps> = ({ message, submessage, target }) => {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const errorBECtx = useContext(ErrorBEContext);
  const otpCtx = useContext(OTPContext);

  const width = useWindowInnerWidth();
  const height = useWindowInnerHeight();

  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [fourth, setFourth] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [hasResent, setHasResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const continueHandler = (): void => {
    const payload = `${first}${second}${third}${fourth}`;

    if (target === 'sms') {
      otpCtx.onContinue(
        { otp: payload, action: target },
        setFirst,
        setSecond,
        setThird,
        setFourth
      );
    } else if (target === 'whatsapp') {
      otpCtx.onContinue(
        { otp: payload, action: target },
        setFirst,
        setSecond,
        setThird,
        setFourth
      );
    }
  };

  function clickEventHandler(
    event: KeyboardEvent<HTMLInputElement>,
    id: number
  ): void {
    if (
      event.key === 'Tab' ||
      event.key === ' ' ||
      (isNaN(+event.key) && event.key !== 'Backspace')
    ) {
      return;
    }
    if (event.key === 'Backspace') {
      document.getElementById(`${+id - 1}`)?.focus();
    } else {
      document.getElementById(`${+id + 1}`)?.focus();
    }
  }

  const resendOTPHandler = (): void => {
    if (target === 'email') {
      // API...
    } else if (target === 'whatsapp') {
      // API...
    } else {
      // API...
    }

    setHasResent(true);
    setIsResending(true);
    setCountdown(30);
  };

  const changeSendOTPTargetHandler = (): void => {
    setFirst('');
    setSecond('');
    setThird('');
    setFourth('');
    setHasResent(false);
    setCountdown(0);

    if (target === 'whatsapp') {
      otpCtx.changeOtpTarget('sms');
    } else {
      otpCtx.changeOtpTarget('whatsapp');
    }
  };

  useEffect(() => {
    if (
      target === 'email' &&
      first !== '' &&
      second !== '' &&
      third !== '' &&
      fourth !== ''
    ) {
      const payload = `${first}${second}${third}${fourth}`;
      otpCtx.onContinue(
        { otp: payload, action: target },
        setFirst,
        setSecond,
        setThird,
        setFourth
      );
    }
  }, [otpCtx, target, first, second, third, fourth]);

  useEffect(() => {
    if (countdown === 0) {
      setIsResending(false);
    } else if (countdown > 0 && isResending) {
      setTimeout(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    }
  }, [countdown, isResending]);

  const submessageClasses = `font-poppins text-neutral-soft ${
    height !== undefined && height < 750 ? 'text-xs' : 'text-sm mb-3'
  }`;

  const cardExtraClasses = `flex flex-col gap-4 sm:min-h-[36rem] sm:rounded-[18px] sm:p-6 md:bg-white bg-transparent p-0 w-[90%] ${
    height !== undefined && height >= 860
      ? 'h-[44rem]'
      : height !== undefined && height < 750
      ? 'h-[35rem]'
      : 'h-[40rem]'
  }`;

  const buttonClasses = `focus:outline-none focus:border-b active:scale-[0.95] transition-transform font-poppins text-seeds-button-green hover:border-b border-seeds-button-green disabled:cursor-not-allowed ${
    height !== undefined && height < 750 ? 'text-sm' : ''
  }`;

  let defaultMessage = '';
  let defaultSubmessage: ReactNode = '';
  let resendOTPText = '';

  if (target !== 'email') {
    if (languageCtx.language === 'EN') {
      defaultMessage = 'Register';
      defaultSubmessage = (
        <span className={submessageClasses}>
          Your OTP code has been sent on your{' '}
          {target === 'sms' ? 'SMS.' : 'WhatsApp.'}
          <br />
          Please check your {target === 'sms' ? 'SMS.' : 'WhatsApp.'}
        </span>
      );
      resendOTPText = 'Resend OTP';
    } else {
      defaultMessage = 'Daftar';
      defaultSubmessage = (
        <span className={submessageClasses}>
          Kode OTP Anda telah dikirim ke {target === 'sms' ? 'SMS' : 'WhatsApp'}{' '}
          Anda.
          <br />
          Silakan periksa {target === 'sms' ? 'SMS' : 'WhatsApp'} Anda.
        </span>
      );
      resendOTPText = 'Kirim Ulang';
    }
  } else {
    if (languageCtx.language === 'EN') {
      defaultMessage = 'Enter the OTP code';
      defaultSubmessage = (
        <span className={submessageClasses}>
          Please check your email to get the OTP
          <br />
          code
        </span>
      );
      resendOTPText = hasResent ? 'Resend OTP' : 'Resending';
    } else {
      defaultMessage = 'Masukkan Kode OTP';
      defaultSubmessage = (
        <span className={submessageClasses}>
          Silakan periksa email Anda untuk
          <br />
          mendapatkan kode OTP
        </span>
      );
      resendOTPText = 'Kirim Ulang';
    }
  }

  return (
    <>
      <CardGradient
        defaultGradient={width !== undefined && width > 640}
        extraClasses={cardExtraClasses}
      >
        <div
          className={`z-10 flex flex-col lg:w-1/2 md:w-2/3 sm:w-[80%] w-full mx-auto p-4 bg-white ${
            target === 'email' ? 'h-full' : 'sm:h-full'
          }`}
        >
          <div className="text-center">
            <h3
              className={`font-poppins font-semibold text-neutral-medium ${
                height !== undefined && height < 750
                  ? 'text-lg'
                  : 'mb-2 text-2xl'
              }`}
            >
              {message !== undefined ? message : defaultMessage}
            </h3>
            {submessage !== undefined ? (
              typeof submessage === 'object' ? (
                <p className={submessageClasses}>{submessage}</p>
              ) : (
                submessage
              )
            ) : (
              defaultSubmessage
            )}
          </div>
          <Image
            priority
            src={
              target === 'sms'
                ? SendOTPSms
                : target === 'whatsapp'
                ? SendOTPWhatsApp
                : SendOTPEmail
            }
            alt="send otp code"
            className={`z-10 mx-auto ${
              height !== undefined && height < 750 ? 'mb-2' : 'mb-8'
            }`}
          />
          <h6 className="mb-6 font-poppins font-semibold text-center text-neutral-medium">
            {t('sendOTP.title')}
          </h6>
          <div className="mb-8 flex gap-8">
            {inputs.map(number => (
              <Input
                key={number}
                placeholder=""
                label=""
                extraInputClasses={`${
                  errorBECtx.error.message !== '' ? 'border-warning-hard' : ''
                }`}
                props={{
                  id: number,
                  value:
                    number === 1
                      ? first
                      : number === 2
                      ? second
                      : number === 3
                      ? third
                      : fourth,
                  onChange: (event: ChangeEvent<HTMLInputElement>) => {
                    errorBECtx.onClose();
                    number === 1
                      ? setFirst(event.target.value.replace(/\D/g, ''))
                      : number === 2
                      ? setSecond(event.target.value.replace(/\D/g, ''))
                      : number === 3
                      ? setThird(event.target.value.replace(/\D/g, ''))
                      : setFourth(event.target.value.replace(/\D/g, ''));
                  },
                  onKeyUp: (event: KeyboardEvent<HTMLInputElement>) => {
                    clickEventHandler(event, number);
                  },
                  maxLength: 1,
                  style: {
                    fontWeight: 600,
                    textAlign: 'center',
                    color: '#262626'
                  }
                }}
              />
            ))}
          </div>

          {/* -----INLINE ERROR BLOCK----- */}
          {errorBECtx.error.message !== '' && (
            <p className="mb-4 font-poppins font-light text-center text-sm text-warning-hard">
              {errorBECtx.error.message}
            </p>
          )}

          {/* -----RESEND OTP EMAIL BLOCK----- */}
          {target === 'email' ? (
            <div
              className={`flex items-center gap-1.5 ${
                hasResent ? 'justify-between' : 'justify-center'
              }`}
            >
              {hasResent ? (
                <span
                  className={`font-poppins font-light text-xs text-neutral-soft ${
                    !isResending ? 'invisible' : ''
                  }`}
                >
                  {countdown} {t('sendOTP.countdown')}
                </span>
              ) : (
                <h6 className="font-poppins font-light text-neutral-medium">
                  {t('sendOTP.resendEmail')}
                </h6>
              )}
              <button
                className={buttonClasses}
                disabled={isResending}
                onClick={resendOTPHandler}
              >
                {resendOTPText}
              </button>
            </div>
          ) : (
            <>
              {/* -----RESEND OTP WHATSAPP/SMS BLOCK----- */}
              <div className="flex justify-between items-center gap-1.5">
                <span
                  className={`font-poppins font-light text-xs text-neutral-soft ${
                    !isResending ? 'invisible' : ''
                  }`}
                >
                  {countdown} {t('sendOTP.countdown')}
                </span>
                <button
                  className={buttonClasses}
                  disabled={isResending}
                  onClick={resendOTPHandler}
                >
                  {resendOTPText}
                </button>
              </div>

              {/* -----SEND OTP VIA WHATSAPP/SMS BLOCK----- */}
              <button
                className={`sm:mt-4 mx-auto max-w-fit focus:outline-none focus:border-b active:scale-[0.95] transition-transform font-poppins font-semibold text-seeds-button-green hover:border-b border-seeds-button-green ${
                  height !== undefined && height < 750
                    ? 'mt-4 text-sm'
                    : height !== undefined && height < 896
                    ? 'mt-10'
                    : 'mt-20'
                }`}
                onClick={changeSendOTPTargetHandler}
              >
                {languageCtx.language === 'EN'
                  ? `Another way? Send via ${
                      target === 'sms' ? 'WhatsApp' : 'SMS'
                    }`
                  : `Cara lain? Kirim melalui ${
                      target === 'sms' ? 'WhatsApp' : 'SMS'
                    }`}
              </button>
              <Button
                variant="dark"
                label={t('button.label.confirm')}
                extraClasses="sm:mt-auto mt-8"
                props={{
                  onClick: continueHandler,
                  disabled:
                    first === '' ||
                    second === '' ||
                    third === '' ||
                    fourth === ''
                }}
              />
            </>
          )}
        </div>
      </CardGradient>
    </>
  );
};

export default SendOTP;
