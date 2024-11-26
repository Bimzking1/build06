import { useRouter } from 'next/router';
import React, { useContext, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingContext from '../loading/loading-context';
import ErrorBEContext from './error-be-context';

import Popup from '@/components/popup/Popup';

import { GeneralErrorImage } from 'public/assets/vector';

interface ErrorBEProps {
  children: ReactNode;
}

interface ErrorType {
  code: number | null;
  message: string;
  redirectUrl?: string;
  type: 'inline' | 'popup';
}

const ErrorBEProvider: React.FC<ErrorBEProps> = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const loadingCtx = useContext(LoadingContext);

  const [code, setCode] = useState<number>(200);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'inline' | 'popup'>('popup');

  const redirect = async (): Promise<void> => {
    await router.push(url);
  };

  const openHandler = (payload: ErrorType): void => {
    if (payload.code !== null) {
      setCode(payload.code);
    }
    if (payload.redirectUrl !== undefined) {
      setUrl(payload.redirectUrl);
    }

    setMessage(payload.message);
    setType(payload.type);
  };

  const closeHandler = (): void => {
    setCode(200);
    setMessage('');
    setType('popup');

    if (url !== '') {
      redirect()
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setUrl('');
        });
    }
  };

  const title = t('generalError.title.general');
  let subtitle = t('generalError.subtitle.general');

  if (code === 409) {
    subtitle = message.split(' ').includes('email')
      ? t('generalError.subtitle.conflictEmail')
      : t('generalError.subtitle.conflict');
  }

  const errorBEContext = {
    error: { code, message, type },
    onOpen: openHandler,
    onClose: closeHandler
  };

  return (
    <ErrorBEContext.Provider value={errorBEContext}>
      {!loadingCtx.isLoading && type === 'popup' && message !== '' && (
        <Popup
          onClose={closeHandler}
          onContinue={closeHandler}
          title={title}
          subtitle={subtitle}
          label={t('button.label.tryAgain')}
          src={GeneralErrorImage}
        />
      )}
      {children}
    </ErrorBEContext.Provider>
  );
};

export default ErrorBEProvider;
