import type { DefaultTFuncReturn } from 'i18next';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ArrowBackwardIcon, DeleteIcon, Logo } from 'public/assets/vector';

import CardGradient from './ui/card/CardGradient';

import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';

import ErrorBEContext from '@/store/error-be/error-be-context';
import LanguageContext from '@/store/language/language-context';

const numbersColumn1 = ['1', '4', '7'];
const numbersColumn2 = ['2', '5', '8', '0'];
const numbersColumn3 = ['3', '6', '9', ''];
const dotsRow = ['', '', '', '', '', ''];

const dotContainerClasses = 'relative flex justify-center items-center';

const animationClasses =
  'absolute animate-ping w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-neutral-medium';

interface InputPinProps {
  onCancel: () => void;
  action: string;
  title?: string | DefaultTFuncReturn;
  subtitle?: string | DefaultTFuncReturn;
  className?: string;
  style?: object;
}

const InputPin: React.FC<InputPinProps> = ({
  onCancel,
  action,
  title,
  subtitle,
  className,
  style
}) => {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const errorBECtx = useContext(ErrorBEContext);

  const width = useWindowInnerWidth();

  const [pin, setPin] = useState<string[]>([]);

  const enterPinHandler = (value: string) => () => {
    errorBECtx.onClose();
    setPin(prevData => prevData.concat(value));
  };

  const deletePinHandler = (): void => {
    setPin(prevData => prevData.slice(0, prevData.length - 1));
  };

  useEffect(() => {
    if (pin.length === 6) {
      // todo: nanti handle reset di context cuma kalau berhasil!
      setTimeout(() => {
        setPin([]);
      }, 800);

      // todo: const payload = pin.join('');

      if (action === 'delete-account') {
        // API...
      } else if (action === 'change-email-address') {
        // API...
      } else if (action === 'create-new-pin') {
        // API...
      } else if (action === 'confirm-new-pin') {
        // API...
      }
    }
  }, [pin, action]);

  const isDisabled = pin.length === 6;

  const buttonClasses = `z-10 flex justify-center items-center w-10 h-10 transition-colors rounded-full font-montserrat text-3xl font-semibold hover:bg-gray-200 ${
    !isDisabled ? 'active:bg-gray-300' : 'cursor-not-allowed'
  }`;

  const defaultClasses = `relative overflow-hidden w-full sm:w-[90%] sm:rounded-[18px] sm:h-[36rem] bg-white ${
    width !== undefined && width < 370
      ? 'h-[38rem]'
      : width !== undefined && width < 400
      ? 'h-[45rem]'
      : width !== undefined && width < 415
      ? 'h-[48rem]'
      : ''
  }`;

  const dotClasses = `absolute w-7 h-7 lg:w-9 lg:h-9 rounded-full border-4 ${
    errorBECtx.error.message !== '' ? 'border-warning-hard' : 'border-[#CCDCDC]'
  }`;

  const defaultTitle = t('inputPin.title.enterPin');

  const defaultSubtitle =
    languageCtx.language === 'EN' ? (
      <p className="sm:mb-10 mb-12 text-base text-center font-poppins text-neutral-soft">
        Please enter your PIN number correctly
      </p>
    ) : (
      <p className="sm:mb-10 mb-12 text-base text-center font-poppins text-neutral-soft">
        Silakan masukkan nomor PIN Anda
        {width !== undefined && width >= 640 ? ' ' : <br />}
        dengan benar
      </p>
    );

  console.log(pin);

  return (
    <CardGradient
      defaultGradient
      className={className ?? defaultClasses}
      style={style}
    >
      <div className="max-w-max mx-auto mt-6 mb-36">
        {/* -----Nav & Logo----- */}
        <div className="relative flex items-center sm:mb-8 mb-10">
          <button
            onClick={onCancel}
            className="absolute left-0 w-10 transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300"
          >
            <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
          </button>
          <span className="mx-auto">
            <Image src={Logo} alt="logo" />
          </span>
        </div>

        {/* -----Title----- */}
        <>
          <h2 className="mb-2 lg:text-3xl text-2xl font-poppins font-semibold text-center text-neutral-medium">
            {title !== undefined ? title : defaultTitle}
          </h2>
          {subtitle !== undefined ? subtitle : defaultSubtitle}
        </>

        {/* -----Dots----- */}
        <div
          className={`transition-all duration-700 flex justify-center items-center gap-14 lg:gap-20 h-10 px-5 ${
            errorBECtx.error.message !== '' ? '' : 'sm:mb-10 mb-16'
          }`}
        >
          {dotsRow.map((_, index) => (
            <span key={index} className={dotContainerClasses}>
              <span
                className={pin.length === index + 1 ? animationClasses : ''}
              ></span>
              <span
                className={
                  pin.length >= index + 1
                    ? `${dotClasses} bg-neutral-medium`
                    : dotClasses
                }
              ></span>
            </span>
          ))}
        </div>
        {errorBECtx.error.message !== '' && (
          <p
            className={`animate-fade-in mt-4 text-center font-light font-poppins text-sm text-warning-hard ${
              errorBECtx.error.message !== '' ? 'sm:mb-10 mb-16' : ''
            }`}
          >
            {errorBECtx.error.message}
          </p>
        )}

        {/* -----Inputs----- */}
        <div className="flex justify-evenly lg:justify-between [&>*]:flex [&>*]:flex-col [&>*]:gap-4">
          <div>
            {numbersColumn1.map(number => (
              <button
                key={number}
                tabIndex={0}
                className={buttonClasses}
                onClick={enterPinHandler(number)}
                disabled={isDisabled}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="mx-8 lg:mx-0">
            {numbersColumn2.map(number => (
              <button
                key={number}
                tabIndex={0}
                className={buttonClasses}
                onClick={enterPinHandler(number)}
                disabled={isDisabled}
              >
                {number}
              </button>
            ))}
          </div>
          <div>
            {numbersColumn3.map(number => (
              <button
                key={number}
                tabIndex={0}
                className={`${buttonClasses} ${
                  number === '' ? 'cursor-pointer active:bg-gray-300' : ''
                }`}
                onClick={
                  number === '' ? deletePinHandler : enterPinHandler(number)
                }
                disabled={number === '' ? false : isDisabled}
              >
                {number === '' ? (
                  <Image src={DeleteIcon} alt="delete-icon" />
                ) : (
                  number
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CardGradient>
  );
};

export default InputPin;
