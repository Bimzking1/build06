import type { DefaultTFuncReturn } from 'i18next';
import { useRouter } from 'next/router';
import React, { useContext, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingContext from '../loading/loading-context';
import SuccessContext from './success-context';

import Popup from '@/components/popup/Popup';

import { GeneralSuccessImage } from 'public/assets/vector';

interface SuccessProps {
  children: ReactNode;
}

interface OpenParams {
  title: string | DefaultTFuncReturn;
  subtitle: string | DefaultTFuncReturn;
  redirectUrl?: string;
}

const ErrorBEProvider: React.FC<SuccessProps> = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const loadingCtx = useContext(LoadingContext);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | DefaultTFuncReturn>('');
  const [subtitle, setSubtitle] = useState<string | DefaultTFuncReturn>('');
  const [url, setUrl] = useState('');

  const redirect = async (): Promise<void> => {
    await router.push(url);
  };

  const openHandler = (payload: OpenParams): void => {
    if (payload.redirectUrl !== undefined) {
      setUrl(payload.redirectUrl);
    }
    setTitle(payload.title);
    setSubtitle(payload.subtitle);
    setOpen(true);
  };

  const closeHandler = (): void => {
    setOpen(false);
    setTitle('');
    setSubtitle('');

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

  const successContext = {
    onOpen: openHandler,
    onClose: closeHandler
  };

  return (
    <SuccessContext.Provider value={successContext}>
      {!loadingCtx.isLoading && open && (
        <Popup
          onClose={closeHandler}
          onContinue={closeHandler}
          title={title}
          subtitle={subtitle}
          label={t('button.label.next')}
          src={GeneralSuccessImage}
        />
      )}
      {children}
    </SuccessContext.Provider>
  );
};

export default ErrorBEProvider;
