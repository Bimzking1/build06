import Image from 'next/image';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ChangeEmailIcon } from 'public/assets/vector';

import Button from './ui/button/Button';
import CardGradient from './ui/card/CardGradient';
import Input from './ui/input/Input';

import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';

import EmailContext from '@/store/email/email-context';
import LanguageContext from '@/store/language/language-context';

const ChangeEmail: React.FC = () => {
  const { t } = useTranslation();
  const emailCtx = useContext(EmailContext);
  const languageCtx = useContext(LanguageContext);

  const width = useWindowInnerWidth();
  const height = useWindowInnerHeight();

  const submitHandler = (): void => {
    const enteredEmail = emailCtx.email;
    emailCtx.validateEmail(enteredEmail);
  };

  const errorMessage =
    emailCtx.email.trim().length === 0
      ? t('errorMessage.requiredEmail')
      : t('errorMessage.invalidEmail');

  const errorClasses =
    height !== undefined && height <= 915
      ? emailCtx.email.trim().length === 0
        ? 'text-xs -bottom-[1.125rem]'
        : 'text-xs -bottom-[2.125rem]'
      : 'text-xs -bottom-[2.125rem]';

  return (
    <>
      <CardGradient
        defaultGradient={width !== undefined && width > 640}
        extraClasses={`w-[90%] sm:rounded-[18px] sm:h-[36rem] ${
          height !== undefined && height >= 860
            ? 'h-[44rem]'
            : height !== undefined && height < 750
            ? 'h-[35rem]'
            : 'h-[40rem]'
        } bg-white sm:p-6 py-6`}
      >
        <div
          className={`z-10 flex flex-col justify-between lg:w-1/2 md:w-2/3 sm:w-[80%] w-full h-full mx-auto sm:p-4 px-4 bg-white`}
        >
          <div>
            <h6
              className={`mb-2 text-center font-poppins font-semibold ${
                height !== undefined && height < 760 ? 'text-sm' : 'text-base'
              }`}
            >
              {t('changeEmailAddress.title')}
            </h6>
            <p
              className={`mb-8 text-center font-poppins ${
                height !== undefined && height < 760 ? 'text-xs' : 'text-sm'
              } text-neutral-soft`}
            >
              {languageCtx.language === 'EN'
                ? 'All information from Seeds is transferred to your'
                : 'Semua informasi dari Seeds ditransfer ke alamat'}
              {width !== undefined && width >= 640 ? <br /> : ' '}
              {languageCtx.language === 'EN' ? 'new address.' : 'baru Anda.'}
            </p>
            <Image
              priority
              src={ChangeEmailIcon}
              alt="input user email"
              className="z-10 mx-auto mb-14"
            />
            <Input
              label={t('input.label.email')}
              placeholder={
                languageCtx.language === 'EN'
                  ? 'example@mail.com'
                  : 'contoh@mail.com'
              }
              isError={emailCtx.isError}
              errorMessage={errorMessage}
              errorClasses={`absolute sm:-bottom-[1.125rem] font-poppins text-warning-hard ${errorClasses}`}
              props={{
                value: emailCtx.email,
                onChange: emailCtx.onChange,
                onBlur: emailCtx.onBlur
              }}
            />
          </div>
          <Button
            variant="dark"
            label={t('button.label.change')}
            props={{
              onClick: submitHandler,
              disabled: emailCtx.isValid === false
            }}
          />
        </div>
      </CardGradient>
    </>
  );
};

export default ChangeEmail;
